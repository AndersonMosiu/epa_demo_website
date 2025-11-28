import './css/Admissions.css';


function Admissions(){
    return(
      <div className="container-fluid admissions">
       <h1>Admissions</h1>
       <p>Learn how to apply from grade 6 - 12</p>
       <div className="row g-2">
       <div className="col-md-9 info">
        <h3>Important Info</h3>
        <ul>
          <li>Admission Requirements</li>
          <li>Application Process</li>
          <li>Fees</li>
        </ul>
       </div>
       <div className="col-md-2 quick-actions">
        <h3>Quick actions</h3><i className='bi bi-ligtning-charge-fill'></i>
         <ul>
          <li>Downnload Application Form</li>
          <li>FAQ</li>
          <li>Fee Schedule PDF</li>
        </ul>
       </div>
      </div>
      </div>
    );
}
export default Admissions;