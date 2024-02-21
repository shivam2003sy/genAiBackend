exports.marksCalculator = (marksObject) => {
    const marks = marksObject.MarksResult;
    // console.log(marks);
    let totalMarks = 0;
    let obtainedMarks = 0;


    let mainMarks  = 0
    let mainObtainedMarks = 0
    
    let additionalMarks = 0
    let additionalObtainedMarks = 0
    let needImprovement ={}
    let Donewell = {}
    let Exelent = {}

    // Iterate over each subject
    for (const subject in marks) {
        const subjectMarks = marks[subject];
        const { marks: subjectMarksValue, topics_covered } = subjectMarks;
        if(subjectMarksValue < 3){
            needImprovement[subject] = subjectMarksValue
        }
        if (subjectMarksValue > 3){
            Donewell[subject] = subjectMarksValue
        }
        if (subjectMarksValue  == 5 ){
            Exelent[subject] = subjectMarksValue
        }

        mainMarks += 25
        mainObtainedMarks += subjectMarksValue *5
        // Iterate over topics covered in the subject
        for (const topic in topics_covered) {
            // Add marks for each covered topic (5 marks per topic)
            

            if (topics_covered[topic]  < 3){
                needImprovement[topic] = topics_covered[topic]
            }
            additionalMarks += 5;
            additionalObtainedMarks  += topics_covered[topic]
        }

    }
    // console.log("Main Marks:", mainMarks);
    // console.log("Main Obtained Marks:", mainObtainedMarks);
    // console.log("Additional Marks:", additionalMarks);
    // console.log("Additional Obtained Marks:", additionalObtainedMarks);
    

    // calculate the  percentage
    totalMarks = mainMarks + additionalMarks;
    obtainedMarks = mainObtainedMarks + additionalObtainedMarks;
    const percentage = (obtainedMarks / totalMarks) * 100;

    // console.log("Total Marks:", totalMarks);
    // console.log("Obtained Marks:", obtainedMarks);
    // console.log("Percentage:", percentage);
    // console.log("Need Improvement:", needImprovement);
    // console.log("Done Well:", Donewell);
    // console.log("Exelent:", Exelent);
    return {
        totalMarks,
        obtainedMarks,
        percentage,
        needImprovement,
        Donewell,
        Exelent
    };
}

