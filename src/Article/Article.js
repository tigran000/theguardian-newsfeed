
import React from 'react'

import classes from './Article.css'

const Arcticle = (props) => (
  <article onClick={props.cliked} className={classes.Article}>
    <h3>  {props.title} </h3>
    <img className={classes.img} src={props.img} alt="" height="300" width="300" />
  </article>
)
export default Arcticle;