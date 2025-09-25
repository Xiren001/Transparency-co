# Laravel Queue Worker Setup for Hostinger

## ✅ Current Status

Your Laravel application now has a scheduled queue worker configured that will process email jobs every minute.

## 🚀 **Production Setup on Hostinger**

### **Step 1: Upload Your Project**

1. Upload your Laravel project to Hostinger
2. Make sure your `.env` file has the correct database and email settings
3. Run `composer install --optimize-autoloader --no-dev`

### **Step 2: Set Up Cron Job in Hostinger**

1. **Log into Hostinger Control Panel**
2. **Go to Advanced → Cron Jobs**
3. **Add New Cron Job** with these settings:

**Cron Job Command:**

```bash
/usr/bin/php /home/u123456789/domains/yourdomain.com/public_html/artisan schedule:run >> /dev/null 2>&1
```

**Important:** Replace the path with your actual path:

- `u123456789` = Your Hostinger username
- `yourdomain.com` = Your actual domain
- Adjust the path to where your Laravel project is located

**Frequency:** Every minute

```
* * * * *
```

### **Step 3: Alternative Hostinger Paths**

Depending on your Hostinger setup, try these path variations:

**Option A (Most Common):**

```bash
/usr/bin/php /home/u123456789/domains/yourdomain.com/public_html/artisan schedule:run
```

**Option B (Subdirectory):**

```bash
/usr/bin/php /home/u123456789/domains/yourdomain.com/public_html/your-project-folder/artisan schedule:run
```

**Option C (Different PHP version):**

```bash
/usr/bin/php8.2 /home/u123456789/domains/yourdomain.com/public_html/artisan schedule:run
```

### **Step 4: Test the Setup**

1. **Submit a contact form** on your website
2. **Wait 1-2 minutes** for the cron job to run
3. **Check if you received the email**

### **Step 5: Monitor Queue Jobs**

You can check if jobs are being processed by looking at your database:

```sql
SELECT * FROM jobs ORDER BY created_at DESC LIMIT 10;
SELECT * FROM failed_jobs ORDER BY failed_at DESC LIMIT 10;
```

## 🔧 **Alternative Method: Direct Queue Processing**

If the scheduler approach doesn't work, you can set up a direct cron job:

**Cron Job Command:**

```bash
/usr/bin/php /home/u123456789/domains/yourdomain.com/public_html/artisan queue:work --once --timeout=60
```

**Frequency:** Every minute

```
* * * * *
```

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Permission Errors:**
    - Make sure your Laravel project has proper file permissions
    - Storage and cache directories should be writable

2. **Path Issues:**
    - Use Hostinger's file manager to find the exact path
    - Check if PHP is at `/usr/bin/php` or `/usr/bin/php8.2`

3. **Database Connection:**
    - Ensure your `.env` database settings are correct for production
    - Test with: `php artisan migrate:status`

4. **Email Settings:**
    - Verify your Gmail SMTP settings work
    - Test with: `php artisan tinker` then `Mail::raw('Test', function($msg) { $msg->to('michael@topshelf.life')->subject('Test'); });`

### **Debug Commands:**

Run these on your server to debug:

```bash
# Test if artisan works
php artisan --version

# Test scheduler
php artisan schedule:list

# Test queue manually
php artisan queue:work --once

# Check logs
tail -f storage/logs/laravel.log
```

## 📊 **Expected Behavior**

Once set up correctly:

1. ✅ Contact forms submit successfully
2. ✅ Emails are queued in the database
3. ✅ Cron job runs every minute
4. ✅ Queue worker processes 1 job per minute
5. ✅ Emails are sent via Gmail SMTP
6. ✅ You receive emails at `michael@topshelf.life`

## 🚨 **Important Notes**

- **Shared Hosting Limitations:** Hostinger may limit long-running processes
- **Queue Jobs:** Using `--once` prevents memory issues on shared hosting
- **Timeout:** 60-second timeout prevents jobs from running too long
- **Overlapping:** `withoutOverlapping()` prevents multiple workers running simultaneously

## 📞 **Need Help?**

If you encounter issues:

1. Check Hostinger's error logs in the control panel
2. Look at `storage/logs/laravel.log` for application errors
3. Test the cron job manually via SSH (if available)
4. Contact Hostinger support for server-specific path information

Your queue worker is now configured and ready for production! 🎉
