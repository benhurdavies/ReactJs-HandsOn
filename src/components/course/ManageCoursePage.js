import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as coursActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import toaster from 'toastr';

class ManageCoursePage extends React.Component{
    constructor(props,context)
    {
        super(props,context);

        this.state={
            course:Object.assign({},this.props.course),
            errors:{},
            saving:false
        };

        this.updateCourseState=this.updateCourseState.bind(this);
        this.saveCourse=this.saveCourse.bind(this);
    }

    componentWillReceiveProps(nextProps)
    {
        if(this.props.course.id!=nextProps.course.id)
        {
            this.setState({course:Object.assign({},nextProps.course)});
        }
    }

    updateCourseState(event){
        const field=event.target.name;
        let course=this.state.course;
        course[field]=event.target.value;
        return this.setState({course:course});
    }

    saveCourse(event)
    {
        event.preventDefault();
        this.setState({saving:true});
        this.props.actions.saveCourse(this.state.course)
            .then(()=>this.redirect())
            .catch(error =>{
                toaster.error(error);
                this.setState({saving:false});
            });
        
    }

    redirect()
    {
        this.setState({saving:false});
        toaster.success('Course Saved');
        this.context.router.push('/courses');
    }

    render(){
        return(
                <CourseForm 
                course={this.state.course}
                allAuthors={this.props.authors}
                onChange={this.updateCourseState}
                onSave={this.saveCourse}
                errors={this.state.errors}
                saving={this.state.saving}/>
        );
    }
}

function getCourseById(courses,id){
    const course=courses.filter(x=>x.id==id);
    if(course)return course[0];
    return null;
}

function mapStateToPops(state,ownProps)
{
    const courseId=ownProps.params.id; //from the pathe `/course/:id`
    let course={id:'',watchHref:'',title:'',authorid:'',length:'',category:''};
    if(courseId && state.courses.length>0)
    {
        course=getCourseById(state.courses,courseId);
    }
    const authorsFormattedForDropdown=state.authors.map(author=>{
        return{
            value:author.id,
            text:author.firstName+' '+author.lastName
        };
    });
    
    return{
        course:course,
        authors:authorsFormattedForDropdown
    };
}

function mapDispatchToProps(dispatch){
    return {
        actions:bindActionCreators(coursActions,dispatch)
        };
    }


ManageCoursePage.propTypes={
   course: PropTypes.object.isRequired,
   authors:PropTypes.array.isRequired,
   actions:PropTypes.object.isRequired
};

ManageCoursePage.contextTypes={
    router:PropTypes.object
};

export default connect(mapStateToPops,mapDispatchToProps)(ManageCoursePage);