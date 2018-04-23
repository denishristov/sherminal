import React, { Component } from 'react';

import Terminal from './Terminal';
import LoginHandler from './LoginHandler';
import UserBar from './UserBar';
import SettingsMenu from './SettingsMenu';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

class Window extends Component {
    constructor(props) {
        super(props);
        this.setupClient = this.setupClient.bind(this);
        this.addTerminal = this.addTerminal.bind(this);
        this.removeTerminal = this.removeTerminal.bind(this);
        this.retrieveSocket = this.retrieveSocket.bind(this);
        this.addMessageHandler = this.addMessageHandler.bind(this);


        this.signOut = this.signOut.bind(this);

        this.state = {
            loggedIn: false,
            terminals: []
        };
        // token for tracking the user
        this.authToken = '';
        // this is bad but works
        this.termid = 0;
        this.messageQueue = [];
    }

    signOut(e) {
        e.preventDefault();

        this.setState({
            loggedIn: false,
            terminals: []
        });
    }

    getTerminal(path, size) {
        this.termid += 1;

        return <Terminal
            key={this.termid}
            userName={path}
            socketURL={path}
            authToken={this.authToken}
            tearDown={this.removeTerminal}
            terminalId={this.termid++}
            setSocket={this.retrieveSocket}
        />;
    }

    addMessageHandler(handler) {
        this.messageQueue.push(handler);
    }

    retrieveSocket(socket) {
        let self = this;
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data);

            for (let msg of self.messageQueue) {
                msg(data);
            }
        });
        this.webSocket = socket;
    }

    setupClient(socketPath, authToken) {
        this.authToken = authToken;
        let new_state = this.state.terminals.slice();
        new_state.push(this.getTerminal(socketPath));

        this.setState({
            loggedIn: true,
            terminals: new_state
        });
    }

    addTerminal(path) {
        let new_terminals = this.state.terminals.slice();
        new_terminals.push();
        new_terminals.push(this.getTerminal(path));

        this.setState({terminals: new_terminals});
    }

    removeTerminal(terminal) {
        let new_state = this.state.terminals.slice();
        let index = new_state.indexOf(terminal);

        new_state.splice(index, 1);

        let loggedIn = true;
        if (new_state.length === 0) {
            loggedIn = false;
        }

        this.setState({terminals: new_state, loggedIn: loggedIn});
    }

    render() {
        if (!this.state.loggedIn) {
            return (<LoginHandler onSubmit={this.setupClient} />);
        } else {
            return (
                <div className="container-fluid">
                    <div className="row upper-row border-bottom border-white">
                        <UserBar registerMessage={this.addMessageHandler} terminal_factory={this.addTerminal}/>
                        <SettingsMenu signOut={this.signOut}/>
                    </div>
                    <div className="row terminal-row">
                        {this.state.terminals}
                    </div>
                </div>
            );
        }
    }
}


export default Window;
