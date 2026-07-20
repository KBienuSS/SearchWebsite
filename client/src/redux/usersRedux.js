const createActionName = (actionName) => `app/users/${actionName}`;

const LOG_IN = createActionName('LOG_IN');
const LOG_OUT = createActionName('LOG_OUT');

export const logIn = payload => ({
    type:LOG_IN,
    payload
});

export const logOut = payload => ({
    type:LOG_OUT
});

export const getUser = (state) => state.user;

const usersReducer = (statePart = null, action) => {
    switch (action.type) {
        case LOG_IN:
            return action.payload;
        case LOG_OUT:
            return null;
        default:
            return statePart;
    }
};

export default usersReducer;