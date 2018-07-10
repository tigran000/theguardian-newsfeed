import React, { Component } from 'react';
import axios from 'axios';
import Highlighter from 'react-highlight-words'
import { withRouter } from 'react-router-dom'

import classes from './FullArcticle.css'

const BASE_URL = 'https://content.guardianapis.com/search?api-key=90d49681-1cb7-4c04-b0f6-067da9d6e6cb'

class FullArcticle extends Component {

  state = {
    loadedPost: null,
    freqs: null,
    text: null
  }

  componentDidMount() {
    this.loadData();
  }

  freqdetector = (string) => {
    var words = string.replace(/[.]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function (w) {
      if (!freqMap[w]) {
        freqMap[w] = 0;
      }
      freqMap[w] += 1;
    });
    let sortable = [];
    for (let vehicle in freqMap) {
      sortable.push([vehicle, freqMap[vehicle]]);
    }
    const sorted = sortable.filter(numb => numb[1] >= 10).map(el => el[0])
    return sorted;
  }

  highliter = (el) => {
    const Y = ' ' + el + ' '
    const text = (<Highlighter
      searchWords={[Y]}
      autoEscape={true}
      textToHighlight={this.state.loadedPost.fields.bodyText}
    />
    )
    this.setState({ text: text })
  }

  loadData() {
    axios.get(`${BASE_URL}&ids=${this.props.history.location.pathname.substr(1)}&show-fields=all`).then(
      response => {
        let page = response.data.response.results[0]
        if (!page.fields.thumbnail) {
          page = {
            ...page, ...{
              fields:
                {
                  thumbnail: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/v1412098443/kdic4eww1d9eatobvr5n.jpg',
                  bodyText: page.fields.bodyText
                }
            }
          }
        }
        let freqs = this.freqdetector(page.fields.bodyText)
        freqs = freqs.filter(el => el !== '/' && el !== '–' && el !== '*' && el !== '-')
        let freqword = freqs.map(el => {
          return <div
            onClick={() => this.highliter(el)}
            className={classes.freqel}
            key={el}>
            {el}
          </div>
        })

        if (freqword.length === 0) {
          freqword = <h4> In this arcticle there are no words which are repeated 10 or more times </h4>
        }
        this.setState({
          loadedPost: page,
          freqs: freqword,
          text: page.fields.bodyText
        })
      }
    )
  }
  render() {
    let post = <p style={{ textAlign: 'center' }}>Loading...!</p>
    if (this.state.loadedPost) {
      post = (
        <div className={classes.post}>
          <h1>{this.state.loadedPost.webTitle}</h1>
          <img src={this.state.loadedPost.fields.thumbnail} alt="" />
          <p> {this.state.text} </p>
          <h3> Words which get repeated 10 or more times</h3>
          <div className={classes.border}> {this.state.freqs} </div>
        </div>
      );
    }
    return post;
  }
}

export default withRouter(FullArcticle);