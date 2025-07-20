import { createAction } from '@reduxjs/toolkit';

export const changeStatusMenuItemStart = createAction<{
  category: string;
  menuItemId: string;
}>('menuItem/changeStatusStart'); 