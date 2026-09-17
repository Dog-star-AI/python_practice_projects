#include <array>
#include <string>
#include <vector>

// Round down all provided student scores.
std::vector<int> round_down_scores(std::vector<double> student_scores) {
    // TODO: Implement round_down_scores
    std::vector<int> int_student_scores;
    
    for(int i = 0; i < student_scores.size(); i++){
        int_student_scores.push_back(static_cast<int>(student_scores[i]));
    }
    
    return int_student_scores;
}

// Count the number of failing students out of the group provided.
int count_failed_students(std::vector<int> student_scores) {
    // TODO: Implement count_failed_students
    int number_students_failed = 0;
    
    for(int i = 0; i < student_scores.size(); i++){
        if(student_scores[i] <= 40) number_students_failed += 1;    
    }
    
    return number_students_failed;
}

// Create a list of grade thresholds based on the provided highest grade.
std::array<int, 4> letter_grades(int highest_score) {
    // TODO: Implement letter_grades
    std::array<int, 4> result;
    int divisor = (highest_score - 40)/4;
    result[0] = 41;
    
    for(int i = 1; i < 4; i++){
         result[i] = result[i-1] + divisor;
    }
    return result;
}

// Organize the student's rank, name, and grade information in ascending order.
std::vector<std::string> student_ranking(
    std::vector<int> student_scores, std::vector<std::string> student_names) {
    // TODO: Implement student_ranking
    std::vector<std::string> result;

    for(int i = 0; i < student_names.size(); i++){
        int index = i + 1;
        
        std::string entry = std::to_string(index) + ". " + student_names[i] + ": " + std::to_string(student_scores[i]);
        result.push_back(entry);
    }
    return result;
}

// Create a string that contains the name of the first student to make a perfect
// score on the exam.
std::string perfect_score(std::vector<int> student_scores,
                          std::vector<std::string> student_names) {
    // TODO: Implement perfect_score
    for(int i = 0; i < student_names.size(); i++){
        if(student_scores[i] == 100) return student_names[i];
    }
    return "";
}
