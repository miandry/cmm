# User Block Schedule Feature

## Overview
This feature allows administrators to block users from accessing the system during specific scheduled times. Users added to the block schedule will be automatically logged out and prevented from logging in during their blocked periods.

## Features

### Schedule Types

1. **Daily Schedule**
   - Block users during specific hours every day
   - Example: Block from 9:00 AM to 5:00 PM daily

2. **Weekly Schedule**
   - Block users on specific days of the week during certain hours
   - Select multiple days (Monday-Sunday)
   - Example: Block on weekdays from 9:00 AM to 5:00 PM

3. **Date Range Schedule**
   - Block users during a specific date and time range
   - Example: Block from March 1, 2026 9:00 AM to March 15, 2026 5:00 PM

## How to Use

### Access the Form
Navigate to: **Admin → People → User Block Schedule**
Or directly: `/admin/people/visitor-block-schedule`

### Adding a Block Schedule

1. **Select Users**
   - Start typing in the "Select Users" field
   - Autocomplete will show matching users
   - You can add multiple users at once

2. **Choose Schedule Type**
   - Daily: Same time every day
   - Weekly: Specific days of the week
   - Date Range: Specific date/time period

3. **Configure Time Settings**
   - For Daily/Weekly: Set start and end times
   - For Weekly: Select which days to block
   - For Date Range: Set start and end date/time

4. **Add Block Reason (Optional)**
   - Provide a message that will be shown to blocked users
   - Example: "System maintenance in progress"

5. **Set Active Status**
   - Check "Active" to enable the schedule immediately
   - Uncheck to create an inactive schedule

6. **Submit**
   - Click "Add Block Schedule" to save

### Managing Schedules

The form displays a table of existing schedules showing:
- User name
- Schedule details (type and times)
- Block reason
- Status (Active/Inactive)
- Actions (Delete)

## How It Works

### Login Check
When a user attempts to log in, the system:
1. Checks if they have any active block schedules
2. Evaluates if the current time falls within a blocked period
3. If blocked:
   - Logs the user out immediately
   - Displays the block reason
   - Redirects to the login page

### Schedule Evaluation

**Daily Schedule:**
- Checks if current time (HH:MM) is between start_time and end_time

**Weekly Schedule:**
- Checks if today is one of the selected days
- If yes, checks if current time is within the blocked hours

**Date Range Schedule:**
- Checks if current timestamp is between start_datetime and end_datetime

## Database Schema

Table: `mz_visitor_block_schedule`

| Field | Type | Description |
|-------|------|-------------|
| id | serial | Primary key |
| uid | int | User ID to block |
| schedule_type | varchar(50) | Type: daily, weekly, date_range |
| start_time | varchar(10) | Start time (HH:MM) for daily/weekly |
| end_time | varchar(10) | End time (HH:MM) for daily/weekly |
| days_of_week | varchar(50) | Comma-separated days (0-6) for weekly |
| start_datetime | int | Start timestamp for date_range |
| end_datetime | int | End timestamp for date_range |
| reason | text | Block reason message |
| active | tinyint | 1=active, 0=inactive |
| created | int | Creation timestamp |

## Installation

1. Enable the module (if not already enabled)
2. Run database updates:
   ```bash
   drush updatedb
   ```
   Or visit: `/update.php`

3. Clear cache:
   ```bash
   drush cr
   ```

## Permissions

Required permission: **Administer users**

Users with this permission can:
- Access the block schedule form
- Add/remove block schedules
- View all existing schedules

## Use Cases

1. **Maintenance Windows**
   - Block all users during system maintenance
   - Use date range schedule for specific maintenance periods

2. **Business Hours Restriction**
   - Block certain users outside business hours
   - Use daily or weekly schedules

3. **Temporary Access Control**
   - Block users for specific time periods
   - Use date range for temporary restrictions

4. **Day-Specific Blocking**
   - Block users on weekends or specific days
   - Use weekly schedule

## Technical Details

### Files Created/Modified

**New Files:**
- `src/Form/BlockScheduleForm.php` - Main form class
- `mz_visitor.install` - Database schema
- `css/block_schedule.css` - Form styling

**Modified Files:**
- `mz_visitor.module` - Added blocking logic hooks
- `mz_visitor.routing.yml` - Added route
- `mz_visitor.libraries.yml` - Added CSS library
- `mz_visitor.links.menu.yml` - Added menu link

### Hooks Implemented

- `hook_user_login()` - Checks block schedule on login
- `hook_schema()` - Defines database table
- Custom helper functions for schedule checking

## Notes

- Multiple schedules can be added for the same user
- If any active schedule matches, the user is blocked
- Inactive schedules are ignored
- The table shows the 20 most recent schedules
- Time comparisons use server time

## Support

For issues or questions, contact the system administrator.
