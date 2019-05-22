import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

const POST_MUTATION = gql`
	mutation PostMutation($description: String!, $url: String!) {
		post(description: $description, url: $url) {
			id
			createdAt
			description
			url
		}
	}
`


class CreateLink extends Component {

	state = {
		description: '',
		url: '',
	}

	render() {
		const { description, url } = this.state
		return (
			<div>
				<div className="flex flex-column mt3">
		          <input
		            className="mb2"
		            value={description}
		            onChange={e => this.setState({ description: e.target.value })}
		            type="text"
		            placeholder="A description for the link"
		          />
		          <input
		            className="mb2"
		            value={url}
		            onChange={e => this.setState({ url: e.target.value })}
		            type="text"
		            placeholder="The URL for the link"
		          />
		        </div>

		        <Mutation 
		        	mutation={POST_MUTATION} 
		        	variables={{ description, url }} 
		        	onCompleted={() => this.props.history.push('/new/1')}
		        	update={(store, { data: { post } }) => {
		        		const first = LINKS_PER_PAGE
		        		const skip = 0
		        		const orderBy = 'createdAt_DESC'

		        		// Note: 'readQuery' always reads data from the local cache while 'query' might retrieve data either from the cache or remotely
		        		const data = store.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy} }) //get current data
		        		data.feed.links.unshift(post)  //data new post at the beginning of links array
		        		store.writeQuery({
		        			query: FEED_QUERY,
		        			data,
		        			variables: { first, skip, orderBy}
		        		})
		        	}}
		        >
		        	{/*all you need to do is call the function that Apollo injects into <Mutation /> component’s render prop function inside onClick button’s event*/}
		        	{postMutation => <button onClick={postMutation}>Submit</button>}
		        </Mutation>
		    </div>
		)
	}
}

export default CreateLink