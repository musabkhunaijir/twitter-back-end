const UsersService = require('../../services/UsersService')

module.exports = {
    async register(req, response) {
        try {
            const { name, email, password, passwordConfirmation } = req.body;

            const result = await new UsersService().register({ name, email, password, passwordConfirmation });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

    async login(req, response) {
        try {
            const { email, password } = req.body;

            const result = await new UsersService().login({ email, password });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

}