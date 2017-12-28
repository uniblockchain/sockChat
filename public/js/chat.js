var currRoom =0;
/**
 * Room list
 */
const RoomTab = (props) => {//function component
    return (
        <a href="#" className="item active">
            <span className="icon">
                <i className="fa fa-inbox"></i>
            </span>
            <span className="name">{props.username}</span>
        </a>
    );
};


class Rooms extends React.Component {
    render() {//class component
        return (
            <div>
                {this.props.rooms.map(user => <RoomTab username={user} />)}
            </div>
        );
    }
}



//init is done by rooms 
//and on init connect, server emmits first set of messages.
class RoomsContainer extends React.Component {
    state = {
        rooms: []
    };
   
    componentDidMount() {
        var socket = io.connect();
        socket.emit('connected', {
            username: myuser,
            hash: userhash
        }, function (data) {
            // alert('connected');
        });
        socket.on('post connect', function (data) {
            console.log('post connect:', data);
            console.log(data.rooms);
            this.setState({
                rooms: data.rooms
            });
            currRoom = this.state.rooms[0];
        }.bind(this));
    }
    newThreadPrompt() {
        var roomName = prompt("Enter the roomname", "Room name here");
        if (roomName == '' || roomName == null) {
            alert('Roomname empty!');
        } else {
            socket.emit('roomNameCheck', {
                roomName: roomName
            }, function (data) {
                if (data.status == 409) {
                    var roomPass = prompt("Enter the room access password", "Password here");
                } else if (data.status = 200) {
                    var roomPass = prompt("Enter desired password for new room. Leave blank for no password", "Password here");
                }
                socket.emit('roomPassCheck', {
                    username: myuser,
                    roomName: roomName,
                    password: roomPass
                }, function (data) {
                    //append to rooms
                    
                });
            });
        }
    }
    render() {//class component
        return (
            <div>
                <div className="compose has-text-centered" id="newThreadParent">
                    <NewThread onClickFunction={this.newThreadPrompt}  />
                </div>
                <div className="main">
                    <Rooms rooms={this.state.rooms} />
                </div>
            </div>
        );
    }
}

//two callbacks for new thread
const NewThread = (props) => {
    var handleClick = () => {
        this.props.onClickFunction();
    }
    return (
        <a onClick={handleClick} className="button is-danger is-block is-bold">
            <span className="compose">New Thread</span>
        </a>
    );
}


/**
 * Message thread
 */
const MsgBubble = (props) => {//function component
    return (
        <div className="box is-primary" >
            <article className="media">
                <div className="media-content">
                    <div className="content" key={props._id}><p>
                        <strong>{ props.user }</strong>
                        <small>@{ props.user }</small>&nbsp;
                        <small>{props.time}</small>
                        <br />{ props.message }</p>
                    </div>
                </div>
            </article>
        </div>
    );
};


class MsgThread extends React.Component {
    render() {//class component
        return (
            <div>
                {/* {this.props.messages.map(card => <MsgBubble {...card} />)} */}
            </div>
        );
    }
}


class MessageArea extends React.Component {
    state = {
        messages: [
            {
                _id: 12413524634523,
                user: "tameeshb",
                time: "10m",
                message: "Hi!"
            }
        ]
    };
    componentDidMount() {
        console.log("msgarea:",currRoom);
    }
    render() {//class component
        return (
            <MsgThread messages={this.state.messages} />
        );
    }
}


/**
 * Room Info
 */
const OnlineUser = (prop) => {
    render(
        <span className="panel-block">
            <span className="panel-icon">
                <i className="fa fa-user"></i>
            </span>User1
        </span>
    );
}

// class OnlineUsers extends React.Component {
//     state = {
//         onlineUsers: []
//     };
//     componentDidMount() {
//         socket.on('post connect', function (data) {
//             console.log('post connect:', data);

//         });
//         socket.on('new user', function (data) {
//             console.log('post connect:', data);

//         });
//         socket.on('newRoomInfo', function (data) {
//             console.log('post connect:', data);

//         });
//     }
//     render() {//class component
//         return (
//             <p className="panel-heading">
//                 Active users
//             </p>
//             <div>
//             { this.props.onlineUsers.map(onlineUser => <OnlineUser  />)}
//             </div>
//         );
//     }
// }

ReactDOM.render(
    <MessageArea />,
    document.getElementById('inbox-messages')
);


// ReactDOM.render(
//     <OnlineUsers />,
//     document.getElementById('activeUserpanel')
// );
// ReactDOM.render(
//     <NewThread />,
//     document.getElementById('newThreadParent')
// );
ReactDOM.render(
    <RoomsContainer />,
    document.getElementById('conv-list')
);

// ReactDOM.render(
//     <RoomsContainer />,
//     document.getElementById('roomsList')
// );