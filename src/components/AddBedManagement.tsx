import React from 'react';
import ManagementTemplate from './ManagementTemplate';

const AddBedManagement: React.FC = () => {
  return (
    <ManagementTemplate
      title="Bed"
      placeholder="Enter Bed Number or Details"
      addButtonLabel="Upload Bed"
    />
  );
};

export default AddBedManagement;
