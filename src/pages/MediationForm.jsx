import { useState } from "react";
import "./MediationForm.css";
import mediationImg from "../assets/Dhyan.png";

import { db } from "../firebase";
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";

function MediationForm() {

    const [name,setName]=useState("");
    const [idno,setIdno]=useState("");
    const [dob,setDob]=useState("");
    const [mobile,setMobile]=useState("");
    const [message,setMessage]=useState("");
    const [error,setError]=useState("");

    const clearFields=()=>{
        setName("");
        setIdno("");
        setDob("");
        setMobile("");
    };

    const showError=(msg)=>{
        setError(msg);
        clearFields();
        setTimeout(()=>{setError("")},5000);
    };

    const showSuccess=(msg)=>{
        setMessage(msg);
        setTimeout(()=>{setMessage("")},5000);
    };

    const handleNameChange=(e)=>{
        let value=e.target.value.toUpperCase().replace(/[^A-Z ]/g,"");
        setName(value);
    };

    const handleIdChange=(e)=>{
        let value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"");
        if(value.length<=4){
            setIdno(value);
        }
    };

    const handleMobileChange=(e)=>{
        let value=e.target.value.replace(/[^0-9]/g,"");
        setMobile(value);
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();

        const idPattern=/^[A-Z]{1}[0-9]{3}$/;
        const mobilePattern=/^[0-9]{10}$/;

        if(name.trim()===""){
            showError("Name is required");
            return;
        }

        if(!idPattern.test(idno)){
            showError("ID must be 1 letter + 3 numbers (Example A123)");
            return;
        }

        if(!mobilePattern.test(mobile)){
            showError("Mobile number must be exactly 10 digits");
            return;
        }

        if(!dob){
            showError("Please select Date of Birth");
            return;
        }

        try{

            /* Check duplicate ID */

            const docRef=doc(db,"mediationUsers",idno);
            const docSnap=await getDoc(docRef);

            if(docSnap.exists()){
                showError("This ID already exists");
                return;
            }

            /* Check duplicate Mobile */

            const mobileQuery=query(
                collection(db,"mediationUsers"),
                where("mobile","==",mobile)
            );

            const mobileSnap=await getDocs(mobileQuery);

            if(!mobileSnap.empty){
                showError("This mobile number already exists");
                return;
            }

            /* Save data */

            await setDoc(docRef,{
                name,
                idno,
                mobile,
                dob,
                createdAt:serverTimestamp()
            });

            showSuccess("Form Data Successfully Submitted");

            clearFields();

        }catch(error){
            console.error(error);
            showError("Error saving data");
        }

    };

    return(
        <div className="page-container">

            <div className="image-card">
                <img src={mediationImg} alt="meditation"/>
            </div>

            <div className="form-card">

                <h2>Mediation Program Data Collection</h2>

                <form onSubmit={handleSubmit}>

                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter Name"
                        required
                    />

                    <label>ID No</label>
                    <input
                        type="text"
                        value={idno}
                        onChange={handleIdChange}
                        placeholder="Example A123"
                        required
                    />

                    <label>Mobile Number</label>
                    <input
                        type="text"
                        value={mobile}
                        onChange={handleMobileChange}
                        placeholder="Enter Mobile Number"
                        maxLength="10"
                        required
                    />

                    <label>Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e)=>setDob(e.target.value)}
                        required
                    />

                    <button type="submit">Submit</button>

                </form>

                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}

            </div>

        </div>
    );
}

export default MediationForm;