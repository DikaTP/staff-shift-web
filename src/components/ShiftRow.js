import React from 'react';

export function ShiftRow(props) {
  return (
    <tr>
      <td>{props.data.name}</td>
      <td>{props.data.date}</td>
      <td>{props.data.start_time} - {props.data.end_time}</td>
      <td className='row-action'>
        <button onClick={() => props.showDetailModal(props.data)} className='detailButton'>Detail</button>
        <button onClick={() => props.showFormModal(true, props.data)} className='editButton'>Edit</button>
        <button onClick={() => props.showDeleteModal(props.data)} className='deleteButton'>Delete</button>
      </td>
    </tr>
  );
}