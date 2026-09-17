namespace targets {
// TODO: Insert the code for the alien class here
class Alien {
    public:
        Alien(int x, int y){
            x_coordinate = x;
            y_coordinate = y;
        }
        int get_health() {return health;}
        bool hit(){
            if(!is_alive()) return false;
            
            health--;
            return true;
        }
        bool shields();
        bool is_alive(){
            return health > 0;
        }
        bool teleport(int x_new, int y_new) {
            x_coordinate = x_new;
            y_coordinate = y_new;

            return true;
        }
        bool collision_detection(const Alien& other){
            if(x_coordinate == other.x_coordinate && y_coordinate == other.y_coordinate) return true;
            else return false;
        }
    
        int x_coordinate, y_coordinate;
    private: 
        int health  = 3;
};
}  // namespace targets
