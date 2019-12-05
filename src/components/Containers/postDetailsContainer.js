import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import axios from 'axios';

class PostDetailsContainer extends Component {
    state = {
        postId: '',
        title: '',
        photo: '',
        content: '',
        titleError: '',
        contentError: '',
        disabled: false,
        editing: false,
    }

    componentDidMount () {
        const post_Id = this.props.id
        axios.get(`${process.env.REACT_APP_API_URL}/posts/post_detail/${post_Id}`)
        .then((res) => {
            console.log(res.data.data)
            this.setState({ 
                postId: res.data.data._id,
                title: res.data.data.title,
                photo: res.data.data.photo,
                content: res.data.data.content
             })
        })
    }

    postValidation = () => {
        const { title, content } = this.state
        let titleError = ''
        let contentError = ''
        
        if (title === '') {
            titleError = `Required, this field can not be empty`
        } 

        if (content === '') {
            contentError = `Required, this field can not be empty`
        }
        if (titleError || contentError) {
            this.setState({ titleError, contentError, disabled: true })
            return false
        }
        if (title !== '' && content !== '') {
            console.log(true)
            this.setState({disabled:false, titleError, contentError})
            return true
        }
    }

    handleDelete = () => {
        const post_Id = this.state.postId
        axios.delete(`${process.env.REACT_APP_API_URL}/posts/delete/${post_Id}`,{withCredentials:true})
        .then(
          this.props.history.push('/')
        )
        .catch(err => console.log(err));
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, }, this.postValidation)
    };

    handleEditSubmit = (e) => {
        e.preventDefault()
        console.log(this.state)
        const post_Id = this.state.postId
        axios.put(`${process.env.REACT_APP_API_URL}/posts/edit/${post_Id}`, this.state)
        .then((res) => {
            this.setState({ editing: !this.state.editing });
         })
    }

    handleEditChange = (e) => {
        e.preventDefault();
        this.setState({ editing: !this.state.editing });
    }

    render () {
        const { content, photo, title } = this.state

        return (
            this.state.editing ? 
            <form>
                <div className="form-group">
                    <label for="exampleFormControlInput1">Title</label>
                    <input onChange={ this.handleChange } type="text" className="form-control" id="exampleFormControlInput1" name="title" value={ title } />
                    <div>{this.state.titleError}</div>
                </div>
                <div className="form-group">
                    <label for="exampleFormControlInput1">Photo</label>
                    <input onChange={ this.handleChange } type="text" className="form-control" id="exampleFormControlInput1" value={ photo } name="photo" />
                </div>
                <div className="form-group">
                    <label for="exampleFormControlTextarea1">Contents</label>
                    <textarea onChange={ this.handleChange } className="form-control" id="exampleFormControlTextarea1" name="content" value={ content } rows="3"></textarea>
                    <div>{this.state.contentError}</div>
                </div>
                <button
                    type="submit"
                    className={`btn btn-primary`}
                    onClick={ this.handleEditSubmit }
                    disabled={ this.state.disabled }
                    >Save</button>
            </form>
            :
            <div>
                <h2>{ title }</h2>
                <p>{ content }</p>
                <button className="btn btn-primary" onClick={ this.handleEditChange }>Edit</button>
                <button onClick={ this.handleDelete } className="btn btn-primary">Delete</button>
            </div>
        )
    }
}

export default withRouter(PostDetailsContainer)