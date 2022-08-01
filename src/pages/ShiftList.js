import React, { Fragment, useEffect, useState, useContext, useCallback } from 'react'
import { Link, useSearchParams } from "react-router-dom";
import { ShiftContext } from "../contexts/ShiftContext";
import {Footer} from '../components/Footer'
import { Header } from '../components/Header'
import { ShiftRow } from '../components/ShiftRow'
import { DeleteModal, DetailModal, FormModal, NotifModal } from '../components/Modal'

export function ShiftList(props) {
  const initialFormData = {
    action: 'Create',
    name: '',
    date: '',
    start_time: '',
    end_time: ''
  }

  const [searchParams] = useSearchParams();

  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { state, dispatch } = useContext(ShiftContext);

  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailContent, setDetailContent] = useState({})

  const [showFormModal, setShowFormModal] = useState(false)
  const [formModalData, setFormModalData] = useState(initialFormData)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteModalContent, setDeleteContent] = useState({})

  const [notifModal, setNotifModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const detailModalHandler = (obj) => {
    let data = obj || {}
    setDetailContent(data)
    setShowDetailModal(!showDetailModal)
  }

  const formModalHandler = (isEdit, obj) => {
    let formData = initialFormData
    if(isEdit) {
      formData = obj
      formData.action = 'Edit'
    }
    
    setFormModalData(formData)
    setShowFormModal(!showFormModal)
  }

  const deleteModalHandler = (obj) => {
    let data = obj || {}
    setDeleteContent(data)
    setShowDeleteModal(!showDeleteModal)
  }

  const paginationElements = (pageCount, currPage) => {
    let elements = []
    elements.push(<Link className={`${currPage > 1 ? '' : 'disabled'}`} key={'prev'} to={"/shifts?page=" + (currPage - 1)}>&laquo;</Link>)
    for(let i=1; i <= pageCount; i++) {
      let url = "/shifts"
      if(i > 1) url += `?page=${i}`
      elements.push(<Link className={`${currPage === i ? "active" : ""}`} key={i} to={url}>{i}</Link>)
    }
    elements.push(<Link className={`${currPage < pageCount ? '' : 'disabled'}`} key={'next'} to={"/shifts?page=" + (currPage + 1)}>&raquo;</Link>)

    return elements
  }

  const getShiftList = useCallback(async() => {
    try{
        let queryStringKeys = ['page', 'limit']
        let queryString = ''
        queryStringKeys.forEach((queryStringKey, index) => {
          let paramValue = searchParams.get(queryStringKey)
          if(queryStringKey === 'limit' && paramValue === null) paramValue = 10
          if(paramValue) {
            queryString += queryString !== '' ? '&' : '?'
            queryString += queryStringKey + '=' + paramValue
          }
        })

        const apiUrl = 'http://localhost:8080/api/v1/shift' + queryString
        const response = await fetch(apiUrl)
        if(response.ok) {
            dispatch({
              payload: {
                data: await response.json(),
              }
            })
            setIsLoaded(true)
            return
        }

        const error = await response.json()
        setIsLoaded(true)
        setError(error)
    } catch(error) {
      setIsLoaded(true)
      setError(error)
    }
  }, [dispatch, searchParams])

  const deleteShift = async() => {
    try{
      let id = deleteModalContent.id
      const apiUrl = "http://localhost:8080/api/v1/shift/" + id
      const response = await fetch(apiUrl, {method: 'DELETE'})
      if(response.ok) {
          setIsLoaded(true)
          setShowDeleteModal(false)
          setModalMessage('Shift Deleted!')
          setNotifModal(true)
          setTimeout(() => setNotifModal(false), 3000)
          getShiftList()
          return
      }

      const error = await response.json()
      console.log(error)
      setIsLoaded(true)
      setError(error)
    } catch(error) {
      setIsLoaded(true)
      setError(error)
    }
  }

  useEffect(() => {
    getShiftList()
  }, [getShiftList])

  if (error) {
    return <Fragment>Error: {error.message}</Fragment>
  } else if (!isLoaded) {
    return <Fragment>Loading...</Fragment>
  } else {
    return (
      <Fragment>
        <Header />
        <div className='wrapper'>
          <div className='action'>
            <button onClick={() => formModalHandler(false)} className='createButton'>Create</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.shifts.map(shift => (
                <ShiftRow key={shift.id} data={shift} showDetailModal={detailModalHandler} showFormModal={formModalHandler} showDeleteModal={deleteModalHandler} />
              ))}
            </tbody>
          </table>
          <div className='inline-between'>
            Showing {(state.page * state.limit) - state.limit + 1 } - {(state.page * state.limit) - state.limit + state.total_display } of {state.total}
            <div className='pagination'>
              {paginationElements(state.total_page, state.page)}
            </div>
          </div>
        </div>
        <DetailModal show={showDetailModal} closeModal={detailModalHandler} data={detailContent} />
        <FormModal show={showFormModal} closeModal={formModalHandler} data={formModalData} />
        <DeleteModal show={showDeleteModal} closeModal={deleteModalHandler} data={deleteModalContent} confirmHandler={deleteShift} />
        <NotifModal show={notifModal} message={modalMessage} />
        <Footer />
      </Fragment>
    )
  }
}