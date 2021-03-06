import React, { Component } from 'react';

import 'react-contexify/dist/ReactContexify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';


class User extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.openTerminal = this.openTerminal.bind(this);

        this.state = {
            username: this.props.username,
            avatar: this.props.avatar,
            notifications : []
        };
    }

    onClick(event) {
        if (!this.props.isLoggedUser) {
            this.openTerminal(false);
        }       
    }

    openTerminal(isLogged) {
        this.props.create_terminal(this.state.username, isLogged);
    }

    render() {
        return (
            <div className={this.props.isLoggedUser ? "user border-left" : ""} onClick={this.onClick}>
                <img
                    src={this.state.avatar}
                    className={this.props.isAdmin ? "avatar admin-avatar" : "avatar"}
                    alt="avatar"
                />
                <p className="text-center username">{this.state.username}</p>
            </div>
        );
    }
}

export default User;
