import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import BasicTableOne from '@/components/tables/BasicTableOne'
import React from 'react'

export default function SellerManagement() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Duyệt hồ sơ bán hàng" />
      <div className="space-y-6">
        <ComponentCard title="Thông tin đơn đăng ký">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  )
}
