import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.status(401).json({ message: "token is required" })
    }

    const secret = process.env.JWT_SECRET
    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: "wrong token" })
        }
        req.userId = decoded?.id
        return next()
    })
}
