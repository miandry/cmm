<?php

namespace Drupal\mz_visitor\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Database\Database;
use Drupal\user\Entity\User;

/**
 * Form to manage user blocking schedules.
 */
class BlockScheduleForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'mz_visitor_block_schedule_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#attached']['library'][] = 'mz_visitor/block_schedule';

    $form['description'] = [
      '#markup' => '<p>' . $this->t('Add users to be blocked during specific scheduled times.') . '</p>',
    ];

    // User selection
    $form['users'] = [
      '#type' => 'entity_autocomplete',
      '#target_type' => 'user',
      '#title' => $this->t('Select Users'),
      '#description' => $this->t('Start typing to search for users. You can add multiple users.'),
      '#tags' => TRUE,
      '#required' => TRUE,
    ];

    // Schedule type
    $form['schedule_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Schedule Type'),
      '#options' => [
        'daily' => $this->t('Daily'),
        'weekly' => $this->t('Weekly'),
        'date_range' => $this->t('Date Range'),
      ],
      '#default_value' => 'daily',
      '#required' => TRUE,
    ];

    // Daily schedule
    $form['daily_schedule'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Daily Schedule'),
      '#states' => [
        'visible' => [
          ':input[name="schedule_type"]' => ['value' => 'daily'],
        ],
      ],
    ];

    $form['daily_schedule']['start_time'] = [
      '#type' => 'time',
      '#title' => $this->t('Start Time'),
      '#default_value' => '09:00',
    ];

    $form['daily_schedule']['end_time'] = [
      '#type' => 'time',
      '#title' => $this->t('End Time'),
      '#default_value' => '17:00',
    ];

    // Weekly schedule
    $form['weekly_schedule'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Weekly Schedule'),
      '#states' => [
        'visible' => [
          ':input[name="schedule_type"]' => ['value' => 'weekly'],
        ],
      ],
    ];

    $form['weekly_schedule']['days'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Days of Week'),
      '#options' => [
        '1' => $this->t('Monday'),
        '2' => $this->t('Tuesday'),
        '3' => $this->t('Wednesday'),
        '4' => $this->t('Thursday'),
        '5' => $this->t('Friday'),
        '6' => $this->t('Saturday'),
        '0' => $this->t('Sunday'),
      ],
    ];

    $form['weekly_schedule']['weekly_start_time'] = [
      '#type' => 'time',
      '#title' => $this->t('Start Time'),
      '#default_value' => '09:00',
    ];

    $form['weekly_schedule']['weekly_end_time'] = [
      '#type' => 'time',
      '#title' => $this->t('End Time'),
      '#default_value' => '17:00',
    ];

    // Date range schedule
    $form['date_range_schedule'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Date Range Schedule'),
      '#states' => [
        'visible' => [
          ':input[name="schedule_type"]' => ['value' => 'date_range'],
        ],
      ],
    ];

    $form['date_range_schedule']['start_date'] = [
      '#type' => 'datetime',
      '#title' => $this->t('Start Date & Time'),
      '#date_date_element' => 'date',
      '#date_time_element' => 'time',
    ];

    $form['date_range_schedule']['end_date'] = [
      '#type' => 'datetime',
      '#title' => $this->t('End Date & Time'),
      '#date_date_element' => 'date',
      '#date_time_element' => 'time',
    ];

    // Block reason
    $form['reason'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Block Reason'),
      '#description' => $this->t('Optional message to display to blocked users.'),
      '#rows' => 3,
    ];

    // Active status
    $form['active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active'),
      '#description' => $this->t('Check to activate this blocking schedule immediately.'),
      '#default_value' => TRUE,
    ];

    $form['actions'] = [
      '#type' => 'actions',
    ];

    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add Block Schedule'),
      '#button_type' => 'primary',
    ];

    // Display existing schedules
    $form['existing_schedules'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Existing Block Schedules'),
      '#weight' => 100,
    ];

    $form['existing_schedules']['table'] = [
      '#type' => 'markup',
      '#markup' => $this->buildScheduleTable(),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $schedule_type = $form_state->getValue('schedule_type');

    if ($schedule_type === 'daily') {
      $start_time = $form_state->getValue('start_time');
      $end_time = $form_state->getValue('end_time');
      
      if ($start_time && $end_time && $start_time >= $end_time) {
        $form_state->setErrorByName('end_time', $this->t('End time must be after start time.'));
      }
    }

    if ($schedule_type === 'weekly') {
      $days = array_filter($form_state->getValue('days'));
      if (empty($days)) {
        $form_state->setErrorByName('days', $this->t('Please select at least one day.'));
      }

      $start_time = $form_state->getValue('weekly_start_time');
      $end_time = $form_state->getValue('weekly_end_time');
      
      if ($start_time && $end_time && $start_time >= $end_time) {
        $form_state->setErrorByName('weekly_end_time', $this->t('End time must be after start time.'));
      }
    }

    if ($schedule_type === 'date_range') {
      $start_date = $form_state->getValue('start_date');
      $end_date = $form_state->getValue('end_date');
      
      if ($start_date && $end_date) {
        $start_timestamp = $start_date->getTimestamp();
        $end_timestamp = $end_date->getTimestamp();
        
        if ($start_timestamp >= $end_timestamp) {
          $form_state->setErrorByName('end_date', $this->t('End date must be after start date.'));
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $connection = Database::getConnection();
    $users = $form_state->getValue('users');
    $schedule_type = $form_state->getValue('schedule_type');
    $reason = $form_state->getValue('reason');
    $active = $form_state->getValue('active') ? 1 : 0;

    foreach ($users as $user_data) {
      $uid = $user_data['target_id'];
      
      $schedule_data = [
        'uid' => $uid,
        'schedule_type' => $schedule_type,
        'reason' => $reason,
        'active' => $active,
        'created' => time(),
      ];

      if ($schedule_type === 'daily') {
        $schedule_data['start_time'] = $form_state->getValue('start_time');
        $schedule_data['end_time'] = $form_state->getValue('end_time');
      }
      elseif ($schedule_type === 'weekly') {
        $days = array_filter($form_state->getValue('days'));
        $schedule_data['days_of_week'] = implode(',', array_keys($days));
        $schedule_data['start_time'] = $form_state->getValue('weekly_start_time');
        $schedule_data['end_time'] = $form_state->getValue('weekly_end_time');
      }
      elseif ($schedule_type === 'date_range') {
        $start_date = $form_state->getValue('start_date');
        $end_date = $form_state->getValue('end_date');
        $schedule_data['start_datetime'] = $start_date->getTimestamp();
        $schedule_data['end_datetime'] = $end_date->getTimestamp();
      }

      $connection->insert('mz_visitor_block_schedule')
        ->fields($schedule_data)
        ->execute();
    }

    $this->messenger()->addStatus($this->t('Block schedule has been added for @count user(s).', [
      '@count' => count($users),
    ]));

    $form_state->setRebuild();
  }

  /**
   * Build the table of existing schedules.
   */
  protected function buildScheduleTable() {
    $connection = Database::getConnection();
    
    $query = $connection->select('mz_visitor_block_schedule', 'bs')
      ->fields('bs')
      ->orderBy('created', 'DESC')
      ->range(0, 20);
    
    $results = $query->execute()->fetchAll();

    if (empty($results)) {
      return '<p>' . $this->t('No block schedules found.') . '</p>';
    }

    $rows = [];
    foreach ($results as $schedule) {
      $user = User::load($schedule->uid);
      $username = $user ? $user->getDisplayName() : $this->t('Unknown');

      $schedule_info = '';
      if ($schedule->schedule_type === 'daily') {
        $schedule_info = $this->t('Daily: @start - @end', [
          '@start' => $schedule->start_time,
          '@end' => $schedule->end_time,
        ]);
      }
      elseif ($schedule->schedule_type === 'weekly') {
        $days_map = [
          '0' => $this->t('Sun'),
          '1' => $this->t('Mon'),
          '2' => $this->t('Tue'),
          '3' => $this->t('Wed'),
          '4' => $this->t('Thu'),
          '5' => $this->t('Fri'),
          '6' => $this->t('Sat'),
        ];
        $days = explode(',', $schedule->days_of_week);
        $day_labels = array_map(function($day) use ($days_map) {
          return $days_map[$day] ?? $day;
        }, $days);
        
        $schedule_info = $this->t('Weekly (@days): @start - @end', [
          '@days' => implode(', ', $day_labels),
          '@start' => $schedule->start_time,
          '@end' => $schedule->end_time,
        ]);
      }
      elseif ($schedule->schedule_type === 'date_range') {
        $schedule_info = $this->t('Range: @start - @end', [
          '@start' => date('Y-m-d H:i', $schedule->start_datetime),
          '@end' => date('Y-m-d H:i', $schedule->end_datetime),
        ]);
      }

      $status = $schedule->active ? $this->t('Active') : $this->t('Inactive');
      $status_class = $schedule->active ? 'status-active' : 'status-inactive';

      $rows[] = [
        'username' => $username,
        'schedule' => $schedule_info,
        'reason' => $schedule->reason ?: '-',
        'status' => '<span class="' . $status_class . '">' . $status . '</span>',
        'actions' => '<a href="/admin/people/visitor-block-schedule/' . $schedule->id . '/delete">' . $this->t('Delete') . '</a>',
      ];
    }

    $header = [
      $this->t('User'),
      $this->t('Schedule'),
      $this->t('Reason'),
      $this->t('Status'),
      $this->t('Actions'),
    ];

    $output = '<table class="block-schedule-table">';
    $output .= '<thead><tr>';
    foreach ($header as $col) {
      $output .= '<th>' . $col . '</th>';
    }
    $output .= '</tr></thead><tbody>';

    foreach ($rows as $row) {
      $output .= '<tr>';
      foreach ($row as $cell) {
        $output .= '<td>' . $cell . '</td>';
      }
      $output .= '</tr>';
    }

    $output .= '</tbody></table>';

    return $output;
  }

}
