import React from "react";


const year = new Date().getFullYear();

function FooterPage(){

    return (
        <div>
             <footer className="neon-footer">
        <small>© {year} @shivuurs.All rights reserved.</small>
      </footer>
        </div>
    );

}

export default FooterPage;