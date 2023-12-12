import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Form, Input } from 'antd';
// import { MailOutlined, UserOutlined, UserAddOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Sidebars from './AdminSidebar';
import apiList from '../lib/apiList';
import axios from 'axios';
import Cookies from 'js-cookie';


const LeaveType = () => {
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();

    const handleAddLeaveType = async () => {
        try {
            const values = await form.validateFields();

            // Send a POST request to your API endpoint
            await axios.post(apiList.leaveType, values, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('adminToken')}`,
                },
            });

            message.success('Leave Type added successfully');
            setShowModal(false);
            form.resetFields();
        } catch (error) {
            console.error('Error adding Leave type:', error);
            message.error('Error adding leave Type. Please try again.');
        }
    };

    return (
        <div>
            <>
                <Sidebars />
                <div style={{ marginTop: "80px", marginLeft: "210px", height: '90vh', overflowY: "scroll"  }} className='p-5'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-3'>

                            </div>
                            <div className='col-md-6'>
                                <div className='card p-5 depart_card' >
                                    <div className='text-center'><h2 style={{fontFamily: "sans-serif"}}>Add  Leave Type</h2></div>
                                    
                                    <Button type="primary" className='' onClick={() => setShowModal(true)} style={{backgroundColor:"#ff8135",padding:"5px 0px 30px"}}>
                                        Add Leave Type
                                    </Button>
                                </div>
                            </div>
                            <div className='col-md-3'>

                            </div>
                        </div>

                    </div>


                    <Modal
                        title="Add Leave type"
                        visible={showModal}
                        onCancel={() => {
                            setShowModal(false);
                            form.resetFields();
                        }}
                        onOk={handleAddLeaveType}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="leaveType"
                                label="leaveType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the Leave Type',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                           
                        </Form>
                    </Modal>
                </div>

            </>

        </div>
    );
}

export default LeaveType