const usersService = require('./users-service');
const repos = require('../authentication/authentication-repository');
const usersRepository = require('./users-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { passwordMatched } = require('../../../utils/password');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const confirm = request.body.confirm_password;

    const user = await usersRepository.findByEmail(request.body.email);
    if (!user) {
      if (password == confirm) {
        const success = await usersService.createUser(
          name,
          email,
          password,
          confirm
        );
        if (!success) {
          throw errorResponder(
            errorTypes.UNPROCESSABLE_ENTITY,
            'Failed to create user'
          );
        }
      } else {
        throw errorResponder(
          errorTypes.INVALID_PASSWORD,
          'Password and confirmation is not the same'
        );
      }
    } else {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const user = await usersRepository.findByEmail(request.body.email);
    if (!user) {
      const success = await usersService.updateUser(id, name, email);
      if (!success) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Failed to update user'
        );
      }
    } else {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const old = request.body.old_password;
    const newp = request.body.new_password;
    const confirm = request.body.confirm_password;
    const email = request.body.email;
    const user = await usersRepository.findByEmail(email);
    if (user) {
      const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
      const passwordChecked = await passwordMatched(old, userPassword);
      if (passwordChecked) {
        if (newp == confirm) {
          const success = await usersService.changePassword(id, newp);
          if (!success) {
            throw errorResponder(
              errorTypes.UNPROCESSABLE_ENTITY,
              'Failed to change password'
            );
          }
        } else {
          throw errorResponder(
            errorTypes.INVALID_PASSWORD,
            'Password and confirmation is not the same'
          );
        }
      } else {
        throw errorResponder(
          errorTypes.INVALID_PASSWORD,
          'Old password is wrong'
        );
      }
    } else {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Not an user');
    }

    return response.status(200).json({ id, name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
};
