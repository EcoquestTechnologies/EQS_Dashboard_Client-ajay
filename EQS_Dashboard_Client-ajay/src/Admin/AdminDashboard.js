import React ,{useEffect, useState} from 'react';
import { Layout, Menu, Breadcrumb, Card, Statistic, Row, Col,Progress, List } from 'antd';
import { MailOutlined, UserOutlined, UserAddOutlined , CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import Sidebars from './AdminSidebar';
import apiList from '../lib/apiList';
import axios from 'axios';
import Cookies from 'js-cookie';


const { Header, Content } = Layout;




  
  const tasks = [
    {
      title: 'Completed Tasks',
      percent: 70,
      status: 'success',
    },
    {
      title: 'In Progress Tasks',
      percent: 30,
      status: 'active',
    },
    {
      title: 'On Hold Tasks',
      percent: 10,
      status: 'exception',
    },
    {
      title: 'Pending Tasks',
      percent: 35,
      status: 'normal',
    },
    {
      title: 'Review Tasks',
      percent: 50,
      status: 'normal',
    },
  ];
  
  const absent = [
    {
      name: 'Martin Lewis',
      date: '4 Sep 2023',
      status: 'Pending',
      icon: <CloseCircleOutlined style={{ color: 'red' }} />,
    },
    {
      name: 'Emma Watson',
      date: '5 Sep 2023',
      status: 'Approved',
      icon: <CheckCircleOutlined style={{ color: 'green' }} />,
    },
    {
      name: 'James Bond',
      date: '6 Sep 2023',
      status: 'Rejected',
      icon: <CloseCircleOutlined style={{ color: 'red' }} />,
    },
  ];
  

const AdminDashboard = () => {
 
  const [allEmployees, setAllEmpEmployees] = useState([]);
  const [loader, setLoader] = useState(true);


  const data = [
    {
      icon: <div style={{backgroundColor: '#FFD700' , width:"50px",height:"50px", textAlign:"center", borderRadius:"40px",paddingTop:"4px"}}><MailOutlined style={{ color: '#000',fontSize:"16px"}}/></div>,
      value: 37,
      title: 'Tasks',
    },
    {
      icon: <div style={{backgroundColor: '#FFD700' , width:"50px",height:"50px", textAlign:"center", borderRadius:"40px",paddingTop:"4px"}}><UserOutlined style={{ color: '#000',fontSize:"16px"}}/></div>,
      value: allEmployees?.length,
      title: 'Employees',
    },
    {
      icon: <div style={{backgroundColor: '#FFD700' , width:"50px",height:"50px", textAlign:"center", borderRadius:"40px",paddingTop:"4px"}}><UserAddOutlined style={{ color: '#000',fontSize:"16px"}}/></div>,
      value: allEmployees?.length,
      title: 'New Employees',
    },
  ];

  useEffect(() => {
    fetchEmployees();
}, []);

const fetchEmployees = async () => {
    setLoader(true);
    try {
        const response = await axios.get(apiList.allEmployees, {
            headers: {
                Authorization: `Bearer ${Cookies.get('adminToken')}`,
            },
        });
        
        setAllEmpEmployees(response.data);
        setLoader(false);
        console.log(response.data)
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
};


  return (

    <>
    <Sidebars/>
    <Layout className="layout p-5"  style={{ marginTop: "80px", marginLeft: "210px", height: '90vh', overflowY: "scroll" }}>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0'}}>
          {/* <Breadcrumb.Item>Home</Breadcrumb.Item> */}
          <Breadcrumb.Item><span className='attendence'>Dashboard</span></Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content mb-3">
          <h1 className='attendence2'>Statistics</h1>
          <Row gutter={16}>
            {data.map((item, index) => (
              <Col key={index} span={8} >
                <Card>
                  <Statistic
                    title={item.title}
                    value={item.value}
                    prefix={item.icon}
                  />
                </Card>
              </Col>
            ))}
          </Row>
         <Card className='mt-2 p-2'>
         <h1 className='attendence2'>Task Statistics</h1>
          <Row gutter={16}>
            <Col span={12}>
              <Progress
                type="dashboard"
                percent={85}
                format={() => '85%'}
                strokeColor="#1890ff"
              />
            </Col>
            <Col span={10}>
              <List
                dataSource={tasks}
                renderItem={(item) => (
                  <List.Item  style={{width:'190px'}}>
                    <Progress
                      percent={item.percent}
                      status={item.status}
                     
                      format={() => item.title}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
          
         </Card>
          
          {/* <Card className='mt-2 p-2 pb-5' >
          <h1 className='attendence2'>Today Absent</h1>
          <Row gutter={16}>
            <Col span={24}>
              <List
                dataSource={absent}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={item.name}
                      description={item.date}
                    />
                    <div>{item.status}</div>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
          </Card> */}
          
          
         
          </div>
     
      </Content>
      
    </Layout>

    </>
  );
};

export default AdminDashboard;