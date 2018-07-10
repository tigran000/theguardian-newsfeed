import React, { Component } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withRouter } from 'react-router-dom'

import Article from './Article/Article'

const BASE_URL = 'https://content.guardianapis.com/search?api-key=90d49681-1cb7-4c04-b0f6-067da9d6e6cb&show-fields=thumbnail&page-size=20'

class Newsfeed extends Component {

  componentDidMount() {
    if (this.props.items.length === 0) {
      this.fetchMoreData();
    }
  }

  componentHandler = (id) => {
    this.props.history.push(id);
  }

  fetchMoreData = () => {
    axios.get(`${BASE_URL}&page=${this.props.page}`).then(
      response => {
        const items = response.data.response.results.map((page, index) => {
          if (!page.fields) {
            page = {
              ...page, ...{
                fields:
                  { thumbnail: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/v1412098443/kdic4eww1d9eatobvr5n.jpg' }
              }
            }
          }
          return page
        })
        this.props.addItems(items);
      }
    )
  }
  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }} >Infinite Scroll</h1>
        <hr />
        <InfiniteScroll
          dataLength={this.props.items.length}
          next={this.fetchMoreData}
          hasMore={true}
          loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
        >
          {this.props.items.map(article => (
            <Article
              key={article.id}
              cliked={() => this.componentHandler(article.id)}
              img={article.fields.thumbnail}
              title={article.webTitle}
            />
          ))}
        </InfiniteScroll>
      </div>
    );
  }
}
export default withRouter(Newsfeed);