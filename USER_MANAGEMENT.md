# User Management System

This document describes the user management system implemented in the Transparency-co application.

## Overview

The user management system allows administrators to:

- View all users in the system
- Assign roles to existing users
- Grant specific permissions to users
- Search and filter users by name or email

## Roles

The system includes four predefined roles:

1. **Admin** - Full system access
    - Can manage all users, products, companies
    - Can access dashboard and analytics
    - Can manage newsletter subscribers
    - Has all permissions by default
    - Can manage user roles and permissions

2. **Moderator** - Content moderation access
    - Can moderate user-generated content
    - Can manage products and companies
    - Can access dashboard and analytics
    - Can manage newsletter subscribers
    - Specific permissions for moderation tasks
    - Cannot manage user roles and permissions

3. **Content Manager** - Content management access
    - Can manage products and companies
    - Can create and edit content
    - Can access dashboard and analytics
    - Cannot manage newsletter subscribers
    - Full content management permissions
    - Cannot manage user roles and permissions

4. **User** - Standard user access
    - Can browse products and companies
    - Can subscribe to newsletter
    - Basic user functionality
    - Minimal permissions
    - Cannot access admin areas

## Access Control

### Dashboard Access

- **Admin**: Full access to dashboard and all admin features
- **Moderator**: Access to dashboard and most admin features (except user management)
- **Content Manager**: Access to dashboard and content management features
- **User**: No access to dashboard

### Admin Areas

- **Dashboard**: Available to admin, moderator, and content_manager roles
- **Products Management**: Available to admin, moderator, and content_manager roles
- **Companies Management**: Available to admin, moderator, and content_manager roles
- **Newsletter Management**: Available to admin and moderator roles only
- **User Management**: Available only to admin role

## Permissions

The system includes granular permissions organized by category:

### User Management Permissions

- `view users` - View user list
- `create users` - Create new users
- `edit users` - Edit user information
- `delete users` - Delete users
- `assign roles` - Assign roles to users
- `assign permissions` - Grant permissions to users

### Product Management Permissions

- `view products` - View product list
- `create products` - Create new products
- `edit products` - Edit existing products
- `delete products` - Delete products
- `manage product categories` - Manage product categories

### Company Management Permissions

- `view companies` - View company list
- `create companies` - Create new companies
- `edit companies` - Edit existing companies
- `delete companies` - Delete companies

### Newsletter Management Permissions

- `view newsletter subscribers` - View subscriber list
- `export newsletter data` - Export subscriber data
- `manage newsletter settings` - Configure newsletter settings

### Analytics & Dashboard Permissions

- `view analytics` - Access analytics data
- `view dashboard` - Access admin dashboard
- `export data` - Export various data

### Content Management Permissions

- `moderate content` - Moderate user content
- `approve content` - Approve pending content
- `reject content` - Reject inappropriate content
- `publish content` - Publish content

### System Settings Permissions

- `manage system settings` - Configure system settings
- `view logs` - Access system logs
- `manage backups` - Manage system backups

## Access

### Admin Routes

- `/admin/users` - User role and permission management interface (admin only)
- `/dashboard` - Admin dashboard with analytics (admin, moderator, content_manager)
- `/products` - Product management (admin, moderator, content_manager)
- `/companies` - Company management (admin, moderator, content_manager)
- `/admin/newsletter` - Newsletter management (admin and moderator only)

### Navigation

User management is accessible through the sidebar navigation under "Users" menu item (admin only).
Other admin features are accessible through the sidebar navigation for admin, moderator, and content_manager roles.

### Middleware Protection

- **Admin Role Middleware**: Protects routes for admin, moderator, and content_manager roles
- **Role Middleware**: Protects specific routes for individual roles (e.g., admin-only routes)
- **Role Or Middleware**: Protects routes for users with any of the specified roles (e.g., admin or moderator)

## Features

### User Management Interface

- **User List**: Displays all users with their current roles, permissions, and creation dates
- **Search**: Filter users by name or email
- **Role Assignment**: Dropdown to assign roles to users
- **Permission Management**: Button to open permission management dialog
- **Confirmation Dialogs**: Confirms role assignment before applying changes

### Role Assignment

- Users can have one primary role
- Role changes are applied immediately after confirmation
- Role badges are color-coded for easy identification
- Confirmation dialog prevents accidental role changes

### Permission Management

- **Granular Control**: Assign specific permissions to users
- **Categorized Permissions**: Permissions organized by category (Users, Products, Companies, System)
- **Visual Indicators**: Color-coded permission badges
- **Bulk Management**: Select multiple permissions at once
- **Real-time Updates**: Permission changes applied immediately

### Security Features

- Role-based access control
- Permission-based access control
- Confirmation required for role changes
- Role validation against existing roles
- Permission validation against existing permissions
- Button-level Permission Control: UI buttons are disabled based on user permissions
- Real-time Permission Checking: Frontend validates permissions before allowing actions

## Database

### Roles Table

The roles are stored in the `roles` table with the following structure:

- `id` - Primary key
- `name` - Role name (admin, user, moderator, content_manager)
- `guard_name` - Authentication guard (web)

### Permissions Table

The permissions are stored in the `permissions` table with the following structure:

- `id` - Primary key
- `name` - Permission name (e.g., 'view users', 'create products')
- `guard_name` - Authentication guard (web)

### User-Role Relationship

Users are linked to roles through the `model_has_roles` pivot table, allowing for role assignment and management.

### User-Permission Relationship

Users are linked to permissions through the `model_has_permissions` pivot table, allowing for granular permission assignment.

### Role-Permission Relationship

Roles are linked to permissions through the `role_has_permissions` pivot table, allowing roles to have predefined permission sets.

## Usage

### For Administrators

1. Access the admin panel through the sidebar navigation
2. Click "Users" in the sidebar menu (admin only)
3. Use the dropdown in the "Assign Role" column to change user roles
4. Click "Manage" in the "Manage Permissions" column to grant specific permissions
5. Confirm the role assignment in the dialog that appears

### For Moderators and Content Managers

1. Access the admin panel through the sidebar navigation
2. Use the available menu items (Dashboard, Products, Companies, Newsletter)
3. Cannot access user management features

### Role Assignment Process

1. Navigate to the user management page via sidebar (admin only)
2. Find the user you want to modify
3. Click the dropdown in the "Assign Role" column
4. Select the new role
5. Confirm the assignment in the dialog
6. The role change is applied immediately

### Permission Assignment Process

1. Navigate to the user management page via sidebar (admin only)
2. Find the user you want to modify
3. Click "Manage" in the "Manage Permissions" column
4. Use the tabs to navigate between permission categories
5. Check/uncheck permissions as needed
6. Click "Assign Permissions" to save changes
7. Permissions are applied immediately

### Adding New Roles

To add new roles, modify the `database/seeders/RolesSeeder.php` file and run:

```bash
php artisan db:seed --class=RolesSeeder
```

### Adding New Permissions

To add new permissions, modify the `database/seeders/PermissionsSeeder.php` file and run:

```bash
php artisan db:seed --class=PermissionsSeeder
```

### API Endpoints

- `GET /admin/users` - List all users (admin only)
- `POST /admin/users/{user}/assign-role` - Assign role to user (admin only)
- `POST /admin/users/{user}/assign-permissions` - Assign permissions to user (admin only)

## Security Considerations

1. **Role Validation**: All role assignments are validated against existing roles
2. **Permission Validation**: All permission assignments are validated against existing permissions
3. **Access Control**: Admin routes require appropriate roles
4. **Confirmation Required**: Role changes require explicit confirmation
5. **Input Validation**: All role and permission assignments are validated and sanitized
6. **Granular Control**: Users can have specific permissions beyond their role
7. **Hierarchical Access**: Different roles have different levels of access

## UI Features

- **Color-coded Role Badges**:
    - Admin: Red
    - Moderator: Blue
    - Content Manager: Green
    - User: Gray
- **Color-coded Permission Badges**:
    - Delete permissions: Red
    - Create permissions: Green
    - Edit permissions: Blue
    - View permissions: Gray
- **Responsive Design**: Works on all devices
- **Search Functionality**: Filter users by name or email
- **Confirmation Dialogs**: Prevents accidental role changes
- **Permission Management Dialog**: Organized tabs for different permission categories
- **Real-time Updates**: Role and permission changes are reflected immediately
- **Dynamic Sidebar Navigation**: Shows appropriate menu items based on user role
- **Role-based Menu Items**: Different roles see different navigation options
- **Permission-based Button States**: Buttons are disabled/hidden based on user permissions
- **Granular Action Control**: Each action (create, edit, delete) can be individually controlled

## Future Enhancements

Potential improvements for the user management system:

- Bulk role and permission assignments
- User activity logging
- Permission inheritance from roles
- User invitation system
- Role and permission assignment history
- User export functionality
- Permission templates
- Advanced permission rules (time-based, conditional)
- Role-based dashboard customization
