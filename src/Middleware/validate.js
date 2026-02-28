
export const validation = (schema)=>{
    return (req,res,next)=>{
        let {error} = schema.validate(
            { ...req.body, ...req.params, ...req.query },
            { abortEarly: false }
        );
        if (!error){
            next()
        } else {
            res.status(400).json(error.details)
        }
    }
}