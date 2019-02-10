import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const graphqlQuery = {
      query: `
      query FetchSinglePost($postId: ID!) {
        fetchSinglePost(postId: $postId){
          title
          content
          imageUrl
          creator {
            name
          }
          createdAt
        }
      }`,
      variables: {
        postId
      }
    };
    fetch(`http://localhost:8000/graphql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Fetch Post Failed.');
        }

        this.setState({
          title: resData.data.fetchSinglePost.title,
          author: resData.data.fetchSinglePost.creator.name,
          date: new Date(resData.data.fetchSinglePost.createdAt).toLocaleDateString('en-US'),
          content: resData.data.fetchSinglePost.content,
          image: `http://localhost:8000/${resData.data.fetchSinglePost.imageUrl}`
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
