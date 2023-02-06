// import React from 'react';
// import { Link } from 'react-router-dom';

// import Auth from '../../utils/auth';

// const Header = () => {
//   const logout = (event) => {
//     event.preventDefault();
//     Auth.logout();
//   };
//   return (
//     <header className="bg-primary text-light mb-4 py-3 flex-row align-center">
//       <div className="container flex-row justify-space-between-lg justify-center align-center">
//         <div>
//           <Link className="text-light" to="/">
//             <h1 className="m-0">Movie Lovers</h1>
//           </Link>
//           <p className="m-0">Get into the mind of a movie lover.</p>
//         </div>
//         <div>
//           {Auth.loggedIn() ? (
//             <>
//               <span>Hey there, {Auth.getProfile().data.username}!</span>
//               <div><Link className="text-light" as={Link} to='/me'>
//                     See Your Favorite Movies
//                   </Link>
//               </div>
//               <button className="btn btn-lg btn-light m-2" onClick={logout}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link className="btn btn-lg btn-info m-2" to="/login">
//                 Login
//               </Link>
//               <Link className="btn btn-lg btn-light m-2" to="/signup">
//                 Signup
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';
const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="text-light mb-4 py-3 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div className="title-container">
          <div className="movieLogo" >
          <Link className="movie-logo" to="/">
            <img src="/images/movie-lover-logo.png" alt="movieloverlogo"></img>
            {/* <h1 className="m-0 title" >Movie Lovers</h1> */}
          </Link>
          {/* <p className="m-0 slogan">Get into the mind of a movie lover.</p> */}
          </div>
          
          {Auth.loggedIn() ? (
            <>
              
              <div className="favoriteMovie" >
              <h2>Hey there, {Auth.getProfile().data.username}!</h2>
              </div>
              <div className="logout">
              <Link className="text-light text-end" as={Link} to='/me'>
                    See Your Favorite Movies
                  </Link>
              <button className="btn btn-lg btn-light m-2" onClick={logout}>
                Logout
              </button>
              </div>
            </>
          ) : (
            <>
            <div className='login' id="navbar">
              <Link className="btn btn-lg btn-info m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-lg btn-light m-2" to="/signup">
                Signup
              </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;