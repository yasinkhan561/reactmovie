import React, { Component} from 'react';
import {API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE} from '../../config';
import './Home.css';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from     '../elements/Spinner/Spinner';


class Home extends Component{
 state = {
   movies : [],
   HeroImage: null,
   loading:false,
   currentPage:0,
   totalPages:0,
   searchTerm:''



 }

 componentDidMount(){
 	this.setState({loading:true});
 	const endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
 	this.fetchItems(endPoint);
 }

searchItems = (searchTerm) => {
   let endPoint = '';
   console.log(searchTerm);
   this.setState({
   		movies:[],
   		loading:true,
   		searchTerm
   	})

   if(searchTerm === ''){
      endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-Us&page=1`;
   }else{
      endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-Us&query=${searchTerm}&page=1`;
   }

   this.fetchItems(endPoint);
}

loadMoreItems = () =>{
	let endPoint = '';
	this.setState({loading:true});
	if(this.state.searchTerm === ''){
		endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-Us&page=${this.state.currentPage + 1}`;
	}else{
		endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-Us&query=${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
	}

	this.fetchItems(endPoint);

}



 fetchItems = (endPoint) => {
   fetch(endPoint)
   .then(result => result.json())
   .then(result => {
   	this.setState({
   		movies:[...this.state.movies, ...result.results],
   		HeroImage: this.state.HeroImage || result.results[0],
   		loading:false,
   		currentPage:result.page,
   		totalPages:result.total_pages
   	})
   })
   
 }


render(){
	return(

		<div className="rmdb-home">
		{this.state.HeroImage ?
		<div>
          <HeroImage
            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.HeroImage.backdrop_path}`}
            title = {this.state.HeroImage.original_title}
            text = {this.state.HeroImage.overview}
           />
		  <SearchBar callback={this.searchItems} />
		</div>:null}


		  <div className="rmdb-home-grid">
         <FourColGrid header={this.state.searchTerm ? 'Search Results' : 'Popular Movies ' } loading={this.state.loading} >
           


           {this.state.movies.map( (element, i) => {

            return <MovieThumb key={i}
                               clickable={true} 
                               image={element.poster_path? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                               movieId={element.id}
                               movieName={element.original_title}
                               />

           })


         }



         </FourColGrid>
         {this.state.loading ? <Spinner /> :null}
         {(this.state.currentPage <= this.state.totalPages && !this.state.loading)? <LoadMoreBtn text="Load More" onClick={this.loadMoreItems}  /> : null}
      </div>
		
		 
		  
		</div>
		)
}

}

export default Home;