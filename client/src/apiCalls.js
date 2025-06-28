import axios from "axios"


export const loginCall=async(userCredential,dispatch)=>{
   axios.defaults.baseURL = 'http://localhost:8800/api';
     dispatch({type:"LOGIN_START"});
     try{
        const res=await axios.post("auth/login",userCredential);
        dispatch({type:"LOGIN_SUCCESS",payload:res.data});
     }catch(err){
         dispatch({type:"LOGIN_FAILURE",payload:err})
     }
}

// Remedial: Teacher creates assignment
export const createRemedialAssignment = async (formData) => {
  return axios.post("/remedial/assignment", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Remedial: Get all assignments (for student and teacher)
export const getRemedialAssignments = async () => {
  return axios.get("/remedial/assignments");
};

// Remedial: Student submits solution
export const submitRemedialSolution = async (formData) => {
  return axios.post("/remedial/submission", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Remedial: Teacher gets all submissions for an assignment
export const getRemedialSubmissions = async (assignmentId) => {
  return axios.get(`/remedial/assignment/${assignmentId}/submissions`);
};

// Remedial: Student gets their submissions
export const getStudentSubmissions = async (studentId) => {
  return axios.get(`/remedial/student/${studentId}/submissions`);
};

// Remedial: Teacher assigns marks to a submission
export const assignRemedialMarks = async (submissionId, marksAwarded) => {
  return axios.patch(`/remedial/submission/${submissionId}/marks`, { marksAwarded });
};

// Remedial: Teacher uploads review for a submission
export const uploadRemedialReview = async (submissionId, formData) => {
  return axios.patch(`/remedial/submission/${submissionId}/review`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Remedial: Teacher gets remedial report
export const getRemedialReport = async () => {
  return axios.get("/remedial/report");
};