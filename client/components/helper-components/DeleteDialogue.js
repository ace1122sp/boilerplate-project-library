import React from 'react';

const DeleteDialogue = ({ close, deleteHandler }) => {
  return (
    <div className='dialogue-card dialogue-delete-custom'>
      <h2>Are you sure?</h2>
      <div>
        <button onClick={deleteHandler} className='warning-colors standard-btn'>Delete</button>
        <button onClick={close} className='standard-btn'>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteDialogue;