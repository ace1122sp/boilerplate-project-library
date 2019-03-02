import React from 'react';

const DeleteDialogue = ({ close, deleteHandler }) => {
  return (
    <div>
      <h2>Are you sure?</h2>
      <div>
        <button onClick={deleteHandler}>Delete</button>
        <button onClick={close}>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteDialogue;