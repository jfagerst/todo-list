import { ApiError } from "../helper/ApiError.js"
import { insertTask, selectAllTasks, deleteTas } from "../models/Task.js"

const getTasks = async (req,res,next) => {
    try {
        const result = await selectAllTasks()
        return res.status(200).json(result.rows || [])
    } catch(error) {
        return next(error)
    }
}

const postTask = async(req,res,next) => {
    const { task } = req.body
    console.log("Task to create", task)
    try {
        if(!task || !task.description || task.description.trim().length === 0){
            return next(new ApiError('Task description is required',400))
            /*const error = new Error('Task description is required')
            error.status = 400
            return next(error)*/
        }
        const result = await insertTask(task.description)
        return res.status(201).json({id: result.rows[0].id, description: result.rows[0].description})
    } catch (error) {
        return next(error)
    }
}

const deleteTask = async(req,res,next) => {
    const { id } = req.params
    console.log(`Deleting task with id: ${id}`)
    try {
        const result = await deleteTas(id)
        if(result.rowCount === 0) {
            return next(new ApiError('Task not found', 404))
        }
        
        return res.status(200).json({id:id})
    } catch (error) {
        return next(error)
    }
}

/*
router.delete('/delete/:id', auth,(req, res, next) => {
    const { id } = req.params

    console.log(`Deleting task with id: ${id}`)
    pool.query('delete from task WHERE id = $1',
        [id], (err, result) => {
            if(err) {
                console.error(err.message)
                return next(err)
            }
            if(result.rowCount === 0) {
                //return res.status(404).json({error: 'Task not found'})
                const error = new Error('Task not found')
                error.status = 404
                return next(error)
            }
            return res.status(200).json({id:id})
        })
}) 
*/

export { getTasks,postTask,deleteTask }