import React, { Fragment, useEffect, useState } from 'react';

function Overlay(props) {
  return(
    props.show ? <div className='overlay' onClick={() => props.closeModal ? props.closeModal() : ''}></div> : null
  )
}

function BaseModal(props) {
  return (
    <div className={`my-modal ${props.show ? 'show' : ''}`}>
      {props.children}
    </div>
  )
}

function NotifModal(props) {
  return (
    <Fragment>
      <Overlay show={props.show} closeModal={props.closeModal} />
      <BaseModal show={props.show} >
        <div>{props.message}</div>
      </BaseModal>
    </Fragment>
  )
}

function DetailModal(props) {
  useEffect( () => {
  }, [props.data])
  return (
    <Fragment>
      <Overlay show={props.show} closeModal={props.closeModal} />
      <BaseModal show={props.show}>
        <div className='modal-content'>
          <div className='modal-header'>
            <div>Shift Detail</div>
          </div>
          <div className='modal-body'>
            <div className='inline-between'>
              <div>Name</div>
              <div>{props.data.name}</div>
            </div>
            <div className='inline-between'>
              <div>Date</div>
              <div>{props.data.date}</div>
            </div>
            <div className='inline-between'>
              <div>From</div>
              <div>{props.data.start_time}</div>
            </div>
            <div className='inline-between'>
              <div>To</div>
              <div>{props.data.end_time}</div>
            </div>
          </div>
          <div className='modal-footer'>
            <button className='modal-close-button' onClick={() => props.closeModal()}>Close</button>
          </div>
        </div>
      </BaseModal>
    </Fragment>
  )
}

function FormModal(props) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [disableButton, setDisableButton] = useState(false);
  const [disableCancelButton, setDisableCancelButton] = useState(false);

  let initFormError = {
    name: '',
    date: '',
    start_time: '',
    end_time: '',
  }
  const [formError, setFormError] = useState(initFormError)

  const handleInputChange = (e) => {
    let inputName = e.target.name
    setFormError(initFormError)
    switch(inputName) {
      case 'name':
        setName(e.target.value)
        break;
      case 'date':
        setDate(e.target.value)
        break;
      case 'start_time':
        setStartTime(e.target.value)
        break;
      case 'end_time':
        setEndTime(e.target.value)
        break;
      default:
        break;
    }
  }

  const submitForm = () => {
    let isFormError = false
    let formError = initFormError
    let formData = {
      name: name,
      date: date,
      start_time: startTime,
      end_time: endTime,
    }

    for(let key in formData) {
      if(formData[key] === '') {
        formError[key] = key.replace('_', ' ') + ' cannot be empty!'
        isFormError = true
      }
    }

    if(!isFormError && formData['start_time'] === formData['end_time']) {
      let errorMessage = 'start time and end time must be different '
      formError.start_time = errorMessage
      formError.end_time = errorMessage
      isFormError = true
    }

    if(!isFormError && formData['start_time'] > formData['end_time']) {
      let errorMessage = 'end time have to be after start time '
      formError.end_time = errorMessage
      isFormError = true
    }
    
    if(!isFormError && new Date(formData['date'] + ' ' + formData['start_time'])  < new Date() ) {
      let errorMessage = 'shift cannot be backdated'
      formError.date = errorMessage
      formError.start_time = errorMessage
      isFormError = true
    }

    if(isFormError) {
      setFormError(formError)
      return
    }

    setDisableButton(true)
    setDisableCancelButton(true)
    if(props.data.action === 'Edit') formData.id = props.data.id
    props.submitFormHandler(formData).then(() =>{
        setDisableButton(false)
        setDisableCancelButton(false)
      }
    )
  }

  const closeModal = () => {
    setFormError(initFormError)
    props.closeModal()
  }

  useEffect( () => {
    setName(props.data.action === 'Create' ? '' : props.data.name)
    setDate(props.data.action === 'Create' ? '' : props.data.date)
    setStartTime(props.data.action === 'Create' ? '' : props.data.start_time)
    setEndTime(props.data.action === 'Create' ? '' : props.data.end_time)
  }, [props.data])
  return (
    <Fragment>
      <Overlay show={props.show} closeModal={props.closeModal} />
      <BaseModal show={props.show}>
        <div className='modal-content'>
          <div className='modal-header'>
            <div>{props.data.action} Shift</div>
          </div>
          <div className='modal-body'>
            <form onSubmit={props.handleSubmit}>
              <div className='input-container'>
                <label>Name</label>
                <input type='text' value={name} name='name' onChange={handleInputChange}></input>
                <span className='error'>{formError.name}</span>
              </div>
              <div className='input-container'>
                <label>Date</label>
                <input type='date' value={date} name='date' onChange={handleInputChange}></input>
                <span className='error'>{formError.date}</span>
              </div>
              <div className='input-container'>
                <label>From</label>
                <input type='time' value={startTime} name='start_time' onChange={handleInputChange}></input>
                <span className='error'>{formError.start_time}</span>
              </div>
              <div className='input-container'>
                <label>To</label>
                <input type='time' value={endTime} name='end_time' onChange={handleInputChange}></input>
                <span className='error'>{formError.end_time}</span>
              </div>
            </form>
          </div>
          <div className='modal-footer'>
            <button className='modal-close-button' disabled={disableCancelButton} onClick={() => closeModal()}>Cancel</button>
            <button className='modal-save-button' disabled={disableButton} onClick={() => submitForm()}>Save</button>
          </div>
        </div>
      </BaseModal>
    </Fragment>
  )
}

function DeleteModal(props) {
  const confimDelete = () => {
    props.confirmHandler()
  }

  return(
    <Fragment>
      <Overlay show={props.show} closeModal={props.closeModal} />
      <BaseModal show={props.show}>
        <div className='modal-content'>
          <div className='modal-header'>
            <div>Delete Shift</div>
          </div>
          <div className='modal-body'>
            <div className='inline-between'>
              <div>Name</div>
              <div>{props.data.name}</div>
            </div>
            <div className='inline-between'>
              <div>Date</div>
              <div>{props.data.date}</div>
            </div>
            <div className='inline-between'>
              <div>From</div>
              <div>{props.data.start_time}</div>
            </div>
            <div className='inline-between'>
              <div>To</div>
              <div>{props.data.end_time}</div>
            </div>
          </div>
          <div className='modal-footer'>
            <button className='modal-close-button' onClick={() => props.closeModal()}>Cancel</button>
            <button className='modal-delete-button' onClick={() => confimDelete()}>Delete</button>
          </div>
        </div>
      </BaseModal>
    </Fragment>
  )
}

export { NotifModal, DetailModal, FormModal, DeleteModal }