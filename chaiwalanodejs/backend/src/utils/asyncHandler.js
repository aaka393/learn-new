const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next).
            catch((err) => next(err)))
    }
}

export { asyncHandler }

// const asyncHandLer = () => {}
// const asyncHandLer = (func) => ( ) => { }
// const asyncHandLer = (func) => async ( )


// const asyncHandLer = (fn) => async(res, req, next) => {
//     try {
//          await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             messsage: error.message
//         })
//     }
// }