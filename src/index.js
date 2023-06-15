// import {FrozenLakeEnvViewerObject, CellAgentViewer, GridCellViewer} from "./MLView.js"
// import {FrozenLake, Agent} from "./ML.js"

// import { random } from "numjs";

const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))


var label = ["open", "start", "hall", "wall", "goal"]


class ReinforcementLearningDemo{
    constructor(map_size, agent_num, frozen_ratio){
        this.element = document.createElement("div");
        this.element.innerHTML = `
            <div class="buttons"></div>
            <hbox>
                <div class="env_view"></div>
                <div>
                    <div class="controller"></div>
                    <div class="sliders"></div>
                    <div class="check_box_list"></div>
                </div>        
            </hbox>
            <hbox>
                <div class="information_view"></div>
                <div class="cell_information_view"></div>
            </hbox>
            <div class="episode_step_chart_view"></div>
        `
        this.selected_cell = -1
        this.selected_agent_idx = 0
        this.agent_num = agent_num
        this.map_size = map_size
        
        this.show_exploration_value = false

        this.speed = 100

        this.buttonListDom = new ButtonListObect(["New Map", "Reset Value", "Reset Model", "One Step", "One Episode", "Continue"])
        this.element.getElementsByClassName("buttons")[0].appendChild(this.buttonListDom.getElement())

        this.grid_env_view = new GridEnvironmentView(map_size, map_size, 50);
        this.element.getElementsByClassName("env_view")[0].appendChild(this.grid_env_view.getElement())

        this.controller_view = new ControllerView()
        this.element.getElementsByClassName("controller")[0].appendChild(this.controller_view.getElement())
        
        this.cell_infor_view = new CellInforViewerObject()
        this.element.getElementsByClassName("cell_information_view")[0].appendChild(this.cell_infor_view.getElement())

        this.informationViewer = new InformationViewer();
        this.element.getElementsByClassName("information_view")[0].appendChild(this.informationViewer.getElement())

        this.episode_step_chart_view = new LineChart("Episode", "Step")
        this.element.getElementsByClassName("episode_step_chart_view")[0].appendChild(this.episode_step_chart_view.getElement())
        // document.body.appendChild(chart.element)
        

        // this.env = new FrozenLake(map_size, frozen_ratio)
        this.env = new ChangingFrozenLake1()
        
        this.agent = new Agent(this.env.getStates(), this.env.getActions())
        this.agent.goal_callback.add(() => this.informationViewer.goal += 1)
        this.agent.hall_callback.add(() => this.informationViewer.hall += 1)
        this.agent.after_step_callback.add(() => this.informationViewer.step += 1)
        this.agent.first_state.add((state) => {this.informationViewer.state += 1})
        this.agent.first_state_action.add((state, action) => this.informationViewer.state_action += 1)
        this.agent.after_action_value_update_callback.add((state, action) => {
            this.update_grid_env_view_cell_value(state)
            if(state == this.selected_cell){
                this.cell_infor_view.q_value = this.agent.get_q_values_for_state(state)
                this.cell_infor_view.tau = this.agent.get_tau_values_for_state(state)
            }

        })
        this.agent.policy.epsilon_auto_change_callback.add((epsilon => {this.controller_view.policy_controller_view.epsilon_slider.value = math_util.floor(epsilon, 3)}))
        this.agent.policy.kappa_auto_change_callback.add((kappa => {this.controller_view.policy_controller_view.kappa_slider.value = math_util.floor(kappa, 5)}))

        this.buttonListDom.objects["New Map"].OnClickCallback.add(() => {
            this.env.new_map()
            this.grid_env_view.setStateMap(this.env.getMap())
            
        })
        this.buttonListDom.objects["Reset Value"].OnClickCallback.add(() => {
            this.get_selected_agent().reset_all_value()
            this.update_grid_env_view_call_value_all()
        })


        this.buttonListDom.objects["Reset Model"].OnClickCallback.add(() => {this.agent.reset_all_model()})
        this.buttonListDom.objects["One Step"].OnClickCallback.add(() => {this.one_step()})
        this.buttonListDom.objects["One Episode"].OnClickCallback.add(() => {this.one_episode()})
        this.buttonListDom.objects["Continue"].OnClickCallback.add(() => {this.infinite_step()})


        this.controller_view.main_controller_view.sliderListDom.objects["Speed"].OnInputCallback.add((value) => this.speed = (1000**(1-value)))
        this.controller_view.main_controller_view.checkBoxListDom.objects["use_oblivion"].onChangedCallBack.add((checked) => {this.agent.use_forget = checked})


        this.controller_view.policy_controller_view.epsilon_slider.OnInputCallback.add((value) => this.agent.epsilon = value)
        this.controller_view.policy_controller_view.epsilon_check_box.onChangedCallBack.add((checked) => {this.agent.policy.use_auto_epsilon = checked})
        this.controller_view.policy_controller_view.kappa_slider.OnInputCallback.add((value) => this.agent.kappa = value*0.001)
        this.controller_view.policy_controller_view.kappa_check_box.onChangedCallBack.add((checked) => {this.agent.policy.use_auto_kappa = checked})

 
        
        this.controller_view.value_controller_view.sliderListDom.objects["Gamma"].OnInputCallback.add((value) => this.agent.gamma = value)
        this.controller_view.value_controller_view.sliderListDom.objects["Step Size"].OnInputCallback.add((value) => this.agent.step_size = value)

        this.grid_env_view.ctrl_click_callback.add((x, y) => this.change_map_cell(x, y))
        this.grid_env_view.onDoubleClickCallback.add((x, y) => this.change_map_cell(x, y))
        this.grid_env_view.click_callback.add((x, y) => {this.selected_cell = this.env.coordinate_to_state(x, y)})
        // this.grid_env_view.setStateMap(this.env.getMap())
        // this.env_view.setValueMap(this.agentGroup.agents[0].policy.getStateValueMap())
        // this.grid_env_view.setRewardMap(this.env.getRewardMap())
        this.update_map_view()
    }
    change_map_cell(x, y){
        var state = this.env.coordinate_to_state(x, y)
        var type = this.env.get_type(state)
        type = (type == "H")? "F" : "H"
        var success = this.env.modify(state, type)
        if(success){
            this.grid_env_view.setState(x, y, this.env.getMap()[y][x])
            this.grid_env_view.setReward(x, y, this.env.getRewardMap()[y][x])
        }
        // this.env_view.setArrowsMap(this.agentGroup)/
    }

    update_map_view(){
        this.grid_env_view.setStateMap(this.env.getMap())
        this.grid_env_view.setRewardMap(this.env.getRewardMap())
    }
    
    update_grid_env_view_cell_value(state){
        var x, y
        [x, y] = this.env.state_to_coordinate(state)
        var state_value = this.agent.get_state_value(state)
        var action_value = this.agent.get_action_values_for_state(state)
        this.grid_env_view.setValue(x, y,  Math.floor(state_value*100)/100)
        this.grid_env_view.setArrows(x, y, action_value)
    }

    update_grid_env_view_call_value_all(){
        for(var state of this.env.state_list){
            this.update_grid_env_view_cell_value(state)
        }
    }

    getElement(){
        return this.element
    }

    get_selected_agent(){
        return this.agents[this.selected_agent_idx]
    }


    update_cell_view(state){
        this.cell_infor_view.q_value = this.agents[0].q_manager.get_values_for_state(state)
        this.cell_infor_view.q_mean = this.agents[0].q_manager.get_reward_means_for_state(state)
        this.cell_infor_view.q_std = this.agents[0].q_manager.get_reward_standard_deviations_for_state(state)
        this.cell_infor_view.tau = this.agents[0].tau_value_table.get_taus_for_state(state)
    }

    initAgent(){
        let x, y
        [x, y] = this.env.state_to_coordinate(this.agent.past_state)
        this.grid_env_view.showAgent(x, y, 0, false)

        this.agent.start(0)
        this.grid_env_view.showAgent(0, 0, 0, true)
    }

    one_step(){
        // agent 지우기 
        var agent = this.agent
        if(agent.finished){
            this.initAgent()
            let x, y
            [x, y] = this.env.state_to_coordinate(agent.past_state)
            this.grid_env_view.showAgent(x, y, 0, true)
        }else{
            let x, y
            [x, y] = this.env.state_to_coordinate(agent.past_state)
            this.grid_env_view.showAgent(x, y, 0, false)
            
        
            // agent 액션 수행
            let state, reward, done
            [state, reward, done] = this.env.step(agent.past_state, agent.past_action)
            
            // agent 그리기
            let nx, ny
            [nx, ny] = this.env.state_to_coordinate(state)
            this.grid_env_view.showAgent(nx, ny, 0, true)
            

            if (done == true){
                if(state == this.map_size**2-1){
                    this.informationViewer.goal += 1
                }else{
                    this.informationViewer.hall += 1
                }
                agent.step(reward, state, true)
                return true
            }else{
                agent.step(reward, state, false)
                return false
            }
        }
        
    }

    async one_episode(){
        this.initAgent()
        var step = 0
        while(true){
            var end = this.one_step()
            step += 1
            if(end){
                break;
            }
            await wait(this.speed)
        }
        return step
    }

    async infinite_step(){
        while(true){
            await this.one_step()
            await wait(this.speed)
        }
    }
}


async function experiment(){
    var operator = new ReinforcementLearningDemo(5, 1, 0.7)
    operator.agent.use_forget = true
    operator.speed = 1
    document.body.appendChild(operator.getElement())

    var step_list = []
    var forget_history_list = []
    for(var i=0 ; i<7 ; i++){
        for(var j=0 ; j<30 ; j++){
            var step_num = await operator.one_episode()
            operator.episode_step_chart_view.add(step_num)
            operator.episode_step_chart_view.update()
            step_list.push(step_num)
            
        }
        operator.env.next_map()
        operator.update_map_view()
        
    }
    return [step_list, operator.agent.forget_history]
}

async function experiment2(){
    var operator = new ReinforcementLearningDemo(5, 1, 1)
    operator.agent.use_forget = false
    operator.speed = 1
    document.body.appendChild(operator.getElement())

    var step_list = []
    
    for(var i=0 ; i<30 ; i++){
        var step_num = await operator.one_episode()
        operator.episode_step_chart_view.add(step_num)
        operator.episode_step_chart_view.update()
        step_list.push(step_num)   
    }
    
    return step_list
}

async function f(){
    var element = document.createElement("div")
    document.body.appendChild(element)
    var results = []
    var forget_history_list = []
    for(var i=0 ; i<10 ; i++){
        var [step_list, forget_history] = await experiment()
        results.push(step_list)
        forget_history_list.push(forget_history)    
        
    }
    // console.log(forget_history_list)
    
    element.innerHTML = JSON.stringify(forget_history_list)
}

f()

// experiment2()