// takeEvery helper is a non-blocking saga
// call waits for a promise to resolve

import { takeEvery, call, put, fork } from 'redux-saga/effects';

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
	} catch (e) {}
}

// this is a watcher saga that triggers worker saga(getUsers)
function* watchGetUsersRequest() {
	yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}

const usersSagas = [ fork(watchGetUsersRequest) ];

export default usersSagas;
