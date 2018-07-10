import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import uniqBy from 'lodash.uniqby'
import Newsfeed from './Newsfeed';
import FullArcticle from './FullArcticle/FullArcticle';

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      page: 1
    };
  }

  addItems = items => {
    this.setState(s => ({ items: uniqBy([...s.items, ...items],'id'), page: s.page + 1 }));
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact render={() => <Newsfeed
            page={this.state.page}
            items={this.state.items}
            addItems={this.addItems} />} />
          <Route path={'/:id'} component={FullArcticle} />
        </Switch>
      </div>
    );
  }
}

export default Blog;