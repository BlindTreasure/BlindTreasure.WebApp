'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import BlindBoxDetailContent, {BlindBoxData} from '@/components/staff-blindbox-detail';

const BlindBoxDetailView: React.FC = () => {
  const sampleBoxData: BlindBoxData = {
    id: "76db9c17-5e2b-425a-81aa-b151a563883d",
    name: "TestApproved",
    description: "TestApproved",
    price: 260000,
    totalQuantity: 10,
    imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=blindbox-thumbnails%2Fthumbnails-24f6bceb-d224-42ce-8a7b-04e12eabf94a.webp&version_id=null",
    releaseDate: "2025-06-13T17:00:00Z",
    status: "PendingApproval",
    hasSecretItem: true,
    secretProbability: 10,
    items: [
      {
        productId: "ae3c3257-980e-42a0-992b-818af10c46a9",
        productName: "test2",
        quantity: 1,
        dropRate: 20,
        rarity: "Rare",
        imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=products%2Fproduct_thumbnails_ae3c3257-980e-42a0-992b-818af10c46a9_cf78c96e41bb40d6baa82a489a327b6b.jpg&version_id=null"
      },
      {
        productId: "c5bef2fb-31df-499c-97db-5810cf5d357c",
        productName: "test5",
        quantity: 1,
        dropRate: 5,
        rarity: "Secret",
        imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=products%2Fproduct_thumbnails_c5bef2fb-31df-499c-97db-5810cf5d357c_d320392ac3a442d3a6c82b43a5fb049e.avif&version_id=null"
      },
      {
        productId: "4e61fa15-205b-4045-94f8-6207cb49ccd9",
        productName: "test1",
        quantity: 1,
        dropRate: 30,
        rarity: "Epic",
        imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=products%2Fproduct_thumbnails_4e61fa15-205b-4045-94f8-6207cb49ccd9_70818e414ba441baa0cb24b6be50b4fd.jpg&version_id=null"
      },
      {
        productId: "5ada4664-02dc-4440-9f9f-8788d29a6998",
        productName: "test3",
        quantity: 1,
        dropRate: 15,
        rarity: "Common",
        imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=products%2Fproduct_thumbnails_5ada4664-02dc-4440-9f9f-8788d29a6998_b753310d116149e3a5336ff3c56dd660.jpg&version_id=null"
      },
      {
        productId: "56ef3c3c-8288-4422-b8d5-9d8024fbf2fb",
        productName: "Test",
        quantity: 1,
        dropRate: 15,
        rarity: "Common",
        imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=products%2Fproduct_thumbnails_56ef3c3c-8288-4422-b8d5-9d8024fbf2fb_106a03aff2d244b6b66af73ed63eed68.jpg&version_id=null"
      },
      {
        productId: "5b026946-3bbf-40e3-a3d1-12bc3a191b7c",
        productName: "Hello",
        quantity: 1,
        dropRate: 15,
        rarity: "Common",
        imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=products%2Fproduct_thumbnails_5b026946-3bbf-40e3-a3d1-12bc3a191b7c_77454859690345aa82fa3c08c29d761e.jpg&version_id=null"
      }
    ]
  };

  const handleApprove = () => {
    console.log("Approved blind box");
  };

  const handleReject = () => {
    console.log("Rejected blind box");
  };

  const handleBack = () => {
    console.log("Back to list");
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Nội dung chi tiết */}
        <BlindBoxDetailContent
          blindBoxData={sampleBoxData}
          onApprove={handleApprove}
          onReject={handleReject}
          onBack={handleBack}
        />
    </div>
  );
};

export default BlindBoxDetailView;
