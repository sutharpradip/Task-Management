export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
  VIEWER: 'viewer',
};

export const PERMISSIONS = {
  // Workspace Permissions
  WORKSPACE_VIEW: 'workspace:view',
  WORKSPACE_EDIT: 'workspace:edit',
  WORKSPACE_DELETE: 'workspace:delete',
  WORKSPACE_INVITE: 'workspace:invite',

  // Project Permissions
  PROJECT_CREATE: 'project:create',
  PROJECT_EDIT: 'project:edit',
  PROJECT_DELETE: 'project:delete',

  // Task Permissions
  TASK_CREATE: 'task:create',
  TASK_EDIT: 'task:edit',
  TASK_DELETE: 'task:delete',
  TASK_ASSIGN: 'task:assign',

  // Comment Permissions
  COMMENT_ADD: 'comment:add',
  COMMENT_EDIT: 'comment:edit',
  COMMENT_DELETE: 'comment:delete',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.WORKSPACE_INVITE,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_EDIT,
    PERMISSIONS.PROJECT_DELETE,
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_EDIT,
    PERMISSIONS.TASK_DELETE,
    PERMISSIONS.TASK_ASSIGN,
    PERMISSIONS.COMMENT_ADD,
    PERMISSIONS.COMMENT_EDIT,
    PERMISSIONS.COMMENT_DELETE,
  ],
  [ROLES.MEMBER]: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.PROJECT_EDIT, // Limited to assigned projects usually
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_EDIT,
    PERMISSIONS.TASK_ASSIGN,
    PERMISSIONS.COMMENT_ADD,
    PERMISSIONS.COMMENT_EDIT,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.WORKSPACE_VIEW,
  ],
};

/**
 * Check if a role has a specific permission
 * @param {string} role 
 * @param {string} permission 
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

/**
 * Check if a user has any of the required roles
 * @param {string} userRole 
 * @param {string[]} allowedRoles 
 * @returns {boolean}
 */
export const hasRole = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};
