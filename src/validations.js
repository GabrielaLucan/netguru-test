import Validator from 'validatorjs';

export async function validateCreateMovie(req, res, next) {
    const { title } = req.body;
    const rules = { title: 'required|string' };
    const customMessages = {
        'required.title': 'title is required',
        'string.title': 'title must be a string'
    };

    const validation = new Validator({ title }, rules, customMessages);

    if (validation.fails()) {
        return res.status(401).json(validation.errors);
    }

    return next();
}