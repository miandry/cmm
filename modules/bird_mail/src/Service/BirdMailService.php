<?php

namespace Drupal\bird_mail\Service;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Site\Settings;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use Psr\Log\LoggerInterface;

/**
 * Sends emails directly through the Bird (MessageBird) Email API.
 */
class BirdMailService {

  protected LoggerInterface $logger;

  public function __construct(
    protected ClientInterface $httpClient,
    protected ConfigFactoryInterface $configFactory,
    LoggerChannelFactoryInterface $loggerFactory,
  ) {
    $this->logger = $loggerFactory->get('bird_mail');
  }

  /**
   * Sends an email via the Bird API.
   *
   * @param string|array $to
   *   One recipient or a list of email addresses.
   * @param string $subject
   *   Email subject.
   * @param string $html
   *   HTML body.
   * @param string|null $from
   *   Sender address. Falls back to configured default.
   *
   * @return array
   *   Result with keys: success, http_code, response, error.
   */
  public function send(string|array $to, string $subject, string $html, ?string $from = NULL): array {
    $api_key = $this->getApiKey();
    if ($api_key === '') {
      return $this->fail('Bird Mail: no API key configured.');
    }

    $recipients = $this->normalizeRecipients($to);
    if ($recipients === []) {
      return $this->fail('Bird Mail: recipient is required.');
    }

    $config = $this->configFactory->get('bird_mail.settings');
    $url = $config->get('api_url') ?: 'https://eu1.platform.bird.com/v1/email/messages';
    $from = $from ?: $config->get('from_address') ?: '';

    if ($from === '') {
      return $this->fail('Bird Mail: from address is required.');
    }

    $payload = [
      'from' => $from,
      'to' => $recipients,
      'subject' => $subject,
      'html' => $html,
    ];

    try {
      $response = $this->httpClient->post($url, [
        'headers' => [
          'Authorization' => 'Bearer ' . $api_key,
          'Content-Type' => 'application/json',
        ],
        'body' => json_encode($payload),
        'http_errors' => FALSE,
      ]);

      $http_code = $response->getStatusCode();
      $body = (string) $response->getBody();
      $success = $http_code >= 200 && $http_code < 300;
      $error = $success ? NULL : $this->parseApiError($body, $http_code);

      if ($success) {
        $this->logger->info('Bird Mail sent "@subject" to @to (HTTP @code).', [
          '@subject' => $subject,
          '@to' => implode(', ', $recipients),
          '@code' => $http_code,
        ]);
      }
      else {
        $this->logger->error('Bird Mail failed for "@subject" from @from: HTTP @code — @error', [
          '@subject' => $subject,
          '@from' => $from,
          '@code' => $http_code,
          '@error' => $error,
        ]);
      }

      return [
        'success' => $success,
        'http_code' => $http_code,
        'response' => $body,
        'error' => $error,
      ];
    }
    catch (GuzzleException $e) {
      $http_code = 0;
      $body = NULL;
      if ($e instanceof RequestException && $e->hasResponse()) {
        $http_code = $e->getResponse()->getStatusCode();
        $body = (string) $e->getResponse()->getBody();
      }

      $error = $body ? $this->parseApiError($body, $http_code) : $e->getMessage();
      $this->logger->error('Bird Mail request failed for "@subject": @message', [
        '@subject' => $subject,
        '@message' => $error,
      ]);

      return [
        'success' => FALSE,
        'http_code' => $http_code,
        'response' => $body,
        'error' => $error,
      ];
    }
  }

  /**
   * Returns the configured default From address.
   */
  public function getDefaultFrom(): string {
    return (string) $this->configFactory->get('bird_mail.settings')->get('from_address');
  }

  /**
   * Retrieves the API key from settings.php or config.
   */
  protected function getApiKey(): string {
    $api_key = Settings::get('bird_mail_api_key');
    if (!empty($api_key)) {
      return $api_key;
    }

    return (string) $this->configFactory->get('bird_mail.settings')->get('api_key');
  }

  /**
   * Normalizes recipients to a clean list of email addresses.
   */
  protected function normalizeRecipients(string|array $to): array {
    if (is_string($to)) {
      $to = array_map('trim', explode(',', $to));
    }

    return array_values(array_filter($to));
  }

  /**
   * Extracts a readable error from the Bird API JSON response.
   */
  protected function parseApiError(string $body, int $http_code): string {
    $data = json_decode($body, TRUE);
    if (isset($data['error']['message'])) {
      $name = $data['error']['name'] ?? '';
      return trim($name . ': ' . $data['error']['message']);
    }

    return $body !== '' ? $body : 'HTTP ' . $http_code;
  }

  /**
   * Builds a failed result array and logs the error.
   */
  protected function fail(string $message): array {
    $this->logger->error($message);

    return [
      'success' => FALSE,
      'http_code' => 0,
      'response' => NULL,
      'error' => $message,
    ];
  }

}
