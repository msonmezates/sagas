// takeEvery helper is a non-blocking saga
// takeLatest helper only uses the latest call
// take helper returns the dispatched action
// call helper waits for a promise to resolve
// fork helper creates child processes that run in parallel

import { takeEvery, takeLatest, take, call, put, fork } from 'redux-saga/effects';

import * as actions from '../actions/users';
import * as api from '../api/users';

// getUsers is the worker saga
function* getUsers() {
	try {
		const result = yield call(api.getUsers);
		yield put(
			actions.getUsersSuccess({
				items: result.data.data
			})
		);
	} catch (e) {
		yield put(
			actions.usersError({
				error: 'An error occured while get the user list'
			})
		);
	}
}

// this is a watcher saga that triggers worker saga(getUsers)
function* watchGetUsersRequest() {
	yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}

function* createUser(action) {
	try {
		yield call(api.createUser, { firstName: action.payload.firstName, lastName: action.payload.lastName });
		yield call(getUsers);
	} catch (e) {
		yield put(
			actions.usersError({
				error: 'An error occured while creating a user'
			})
		);
	}
}

function* watchCreateUserRequest() {
	yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUser);
}

function* deleteUser({ userId }) {
	try {
		yield call(api.deleteUser, userId);
		yield call(api.getUsers);
	} catch (e) {
		yield put(
			actions.usersError({
				error: 'An error occured while deleting a user'
			})
		);
	}
}

function* watchDeleteUserRequest() {
	while (true) {
		const action = yield take(actions.Types.DELETE_USER_REQUEST);
		yield call(deleteUser, { userId: action.payload.userId });
	}
}

const usersSagas = [ fork(watchGetUsersRequest), fork(watchCreateUserRequest), fork(watchDeleteUserRequest) ];

export default usersSagas;
