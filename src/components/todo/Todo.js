import { useState, useEffect } from 'react'
import { ImPlus } from 'react-icons/im'
import { RiDeleteBinLine, RiEditLine, RiCheckDoubleFill } from 'react-icons/ri'
import './todo.css'
import React from 'react'

const getTaskFromLocalStorage = () => {
    let existingTasks = localStorage.getItem('tasks');
    if (existingTasks) {
        return JSON.parse(localStorage.getItem('tasks'))
    } else {
        return []
    }
}

const Todo = () => {
    const [taskInput, setTaskInput] = useState('')
    const [tasks, setTasks] = useState(getTaskFromLocalStorage())
    const [updateTask, setUpdateTask] = useState(null)

    const taskInputHandler = (e) => {
        setTaskInput(e.target.value)
    }

    const addTaskHandler = () => {
        if (!taskInput || taskInput.trim() === '') {
            return;
        } else if (taskInput && updateTask) {
            setTasks(
                tasks.map(task => {
                    if (task.id === updateTask) {
                        return { ...task, name: taskInput }
                    }
                    return task;
                })
            )
            setTaskInput('')
            setUpdateTask(null)

        } else {
            const allTasks = { id: Math.random(), name: taskInput, isCompleted: false }
            setTasks(prevTask => {
                return [...prevTask, allTasks]
            })
        }
        setTaskInput('')
    }

    const deleteTaskHandler = (taskID) => {

        const updatedTasks = tasks.filter((task) => task.id !== taskID)
        setTasks(updatedTasks)
    }

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    const editTaskHandler = (taskID) => {

        let editTask = tasks.find(task => task.id === taskID)
        setTaskInput(editTask.name)

        setUpdateTask(taskID)
    }

    const completeTaskHandler = (taskID) => {
        setTasks(tasks.map(task => {
            if (task.id === taskID) {
                return { ...task, isCompleted: !task.isCompleted }
            }
            return task;
        }))
    }

    const enterKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTaskHandler();
        }
    }

    return (
        <>
            <div className='container'>

                <div className="container__heading">
                    <h1>📝Add your tasks</h1>
                </div>

                <div className='container__input'>
                    <input onKeyDown={enterKeyPress} onChange={taskInputHandler} value={taskInput} className='task__input' placeholder='✍Type here...' type="text" />
                    <button onClick={addTaskHandler} title='add task' className='btn__add btn__task'><ImPlus /></button>
                </div>

                <div className="tasks__container">
                    {
                        tasks.map((task) => {
                            return (
                                <div className='task__wrapper' key={task.id}>
                                    <div className='task__container' >
                                        <p className={`task__name ${task.isCompleted ? 'task__completed' : ''}`}>{task.name}</p>
                                    </div>
                                    <button onClick={() => editTaskHandler(task.id)} disabled={task.isCompleted} title='Edit task' className='btn__edit btn__task'><RiEditLine /></button>
                                    <button onClick={() => deleteTaskHandler(task.id)} title='Delete task' className='btn__delete btn__task'><RiDeleteBinLine /></button>
                                    <button onClick={() => completeTaskHandler(task.id)} title='Task completed' className='btn__complete btn__task'><RiCheckDoubleFill /></button>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </>
    )
}

export default Todo;
