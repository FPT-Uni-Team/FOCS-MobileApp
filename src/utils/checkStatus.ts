export const checkActive = (status: string): number => {
  switch (status) {
    case 'UnAvailable':
      return 1;
    case 'Available':
      return 0;
    case 'Not Start':
      return 0;
    case 'On Going':
      return 0;
    case 'Expired':
      return 2;
    default:
      return 2;
  }
};

export const checkShowEdit = (status: string): boolean => {
  switch (status) {
    case 'UnAvailable':
      return false;
    case 'Available':
      return true;
    case 'Not Start':
      return true;
    case 'On Going':
      return true;
    case 'Expired':
      return false;
    default:
      return false;
  }
};

export const checkCanEdit = (status: string): number => {
  switch (status) {
    case 'UnAvailable':
      return 0;
    case 'Not Start':
      return 2;
    case 'On Going':
      return 1;
    case 'Expired':
      return 0;
    default:
      return 0;
  }
};

export const getStatusLabel = (isAvailable: boolean): string => {
  return isAvailable ? 'Available' : 'UnAvailable';
};

export const getStatusColor = (isAvailable: boolean): string => {
  return isAvailable ? '#4CAF50' : '#F44336';
}; 