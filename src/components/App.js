import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getUsersRequest, createUserRequest, deleteUserRequest } from '../actions/users';

import UsersList from './UsersList';
import NewUserForm from './NewUserForm';

class App extends Component {
	constructor(props) {
		super(props);

		this.props.getUsersRequest();
	}

	handleFormSubmit = ({ firstName, lastName }) => {
		this.props.createUserRequest({ firstName, lastName });
	};

	handleUserDelete = (userId) => {
		this.props.deleteUserRequest(userId);
	};

	render() {
		const { users } = this.props;
		return (
			<div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
				<NewUserForm onSubmit={this.handleFormSubmit} />
				<UsersList users={users.items} onDeleteUser={this.handleUserDelete} />
			</div>
		);
	}
}

export default connect(({ users }) => ({ users }), {
	getUsersRequest,
	createUserRequest,
	deleteUserRequest
})(App);
