# Bird Mail

Drupal module that sends emails through the [Bird (MessageBird) Email API](https://docs.bird.com/).

## Requirements

- Drupal 9 or 10
- Bird account with Email API access

## Installation

Copy this module into your Drupal `modules/custom/` (or `modules/`) directory, then enable it:

```bash
drush en bird_mail -y
drush cr
```

## Configuration

1. Go to **Configuration → System → Bird Mail** (`/admin/config/system/bird-mail`)
2. Set your **Bird API key**, **API endpoint**, and **From address**

Or add the API key to `settings.php` (recommended for production):

```php
$settings['bird_mail_api_key'] = 'your_bird_api_key';
```

The **From address** must use a domain verified in your Bird account. For testing you can use `onboarding@messagebird.dev`.

## Usage

Inject or load the `bird_mail.mailer` service:

```php
$mailer = \Drupal::service('bird_mail.mailer');

$result = $mailer->send(
  'user@example.com',
  'Hello',
  '<p>Your HTML body</p>'
);

if ($result['success']) {
  // HTTP 202 — message accepted by Bird
}
else {
  // Check $result['error'] for details (e.g. DomainNotVerified)
}
```

### Response array

| Key         | Description                          |
|-------------|--------------------------------------|
| `success`   | `TRUE` if Bird accepted the message  |
| `http_code` | HTTP status (202 on success)         |
| `response`  | Raw JSON response from Bird          |
| `error`     | Error message if send failed         |

## License

GPL-2.0-or-later
