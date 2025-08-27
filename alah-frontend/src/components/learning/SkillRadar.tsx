'use client';

import { useEffect, useRef } from 'react';

interface UserSkills {
  factualDetection: number;
  logicalReasoning: number;
  consistencyCheck: number;
  attentionAnalysis: number;
  decisionPath: number;
  overallLevel: number;
}

interface SkillRadarProps {
  skills: UserSkills;
}

export function SkillRadar({ skills }: SkillRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const skillLabels = [
    { key: 'factualDetection', label: '事实检测', color: '#3B82F6' },
    { key: 'logicalReasoning', label: '逻辑推理', color: '#10B981' },
    { key: 'consistencyCheck', label: '一致性检验', color: '#F59E0B' },
    { key: 'attentionAnalysis', label: '注意力分析', color: '#EF4444' },
    { key: 'decisionPath', label: '决策路径', color: '#8B5CF6' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius * i) / levels;
      ctx.beginPath();
      ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
      ctx.strokeStyle = i === levels ? '#E5E7EB' : '#F3F4F6';
      ctx.lineWidth = i === levels ? 2 : 1;
      ctx.stroke();
      
      // 绘制分数标签
      if (i > 0) {
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${(i * 20).toString()}`, centerX, centerY - levelRadius + 15);
      }
    }

    // 绘制角度线
    const angleStep = (Math.PI * 2) / skillLabels.length;
    skillLabels.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // 绘制从中心到边缘的线
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 绘制技能标签
      const labelX = centerX + (radius + 25) * Math.cos(angle);
      const labelY = centerY + (radius + 25) * Math.sin(angle);
      
      ctx.fillStyle = '#374151';
      ctx.font = '13px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.label, labelX, labelY);
    });

    // 绘制技能多边形
    ctx.beginPath();
    skillLabels.forEach((skill, index) => {
      const skillValue = skills[skill.key as keyof UserSkills] as number;
      const skillRadius = (radius * skillValue) / 100;
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + skillRadius * Math.cos(angle);
      const y = centerY + skillRadius * Math.sin(angle);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();

    // 填充多边形
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fill();

    // 绘制多边形边框
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制技能点
    skillLabels.forEach((skill, index) => {
      const skillValue = skills[skill.key as keyof UserSkills] as number;
      const skillRadius = (radius * skillValue) / 100;
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + skillRadius * Math.cos(angle);
      const y = centerY + skillRadius * Math.sin(angle);

      // 绘制点
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = skill.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制数值标签
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        Math.round(skillValue).toString(),
        x + 15 * Math.cos(angle),
        y + 15 * Math.sin(angle)
      );
    });

    // 绘制中心点
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#6B7280';
    ctx.fill();

  }, [skills]);

  const getSkillLevel = (score: number) => {
    if (score >= 90) return { level: 'Expert', color: 'text-green-600' };
    if (score >= 75) return { level: 'Advanced', color: 'text-blue-600' };
    if (score >= 60) return { level: 'Intermediate', color: 'text-yellow-600' };
    if (score >= 40) return { level: 'Beginner', color: 'text-orange-600' };
    return { level: 'Novice', color: 'text-red-600' };
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">技能雷达图</h3>
        <p className="text-gray-600">你在各个技能领域的表现分析</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 雷达图 */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        </div>

        {/* 技能详情 */}
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {Math.round(skills.overallLevel)}
            </div>
            <div className="text-sm text-gray-500">综合评分</div>
            <div className={`text-sm font-medium ${getSkillLevel(skills.overallLevel).color}`}>
              {getSkillLevel(skills.overallLevel).level}
            </div>
          </div>

          <div className="space-y-3">
            {skillLabels.map((skill, index) => {
              const skillValue = skills[skill.key as keyof UserSkills] as number;
              const level = getSkillLevel(skillValue);
              
              return (
                <div key={skill.key} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: skill.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {skill.label}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${level.color}`}>
                      {Math.round(skillValue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${skillValue}%`,
                        backgroundColor: skill.color 
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {level.level}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">💡 提升建议</div>
              <div className="text-xs">
                {skills.factualDetection < 60 && '重点加强事实检测能力；'}
                {skills.logicalReasoning < 60 && '提升逻辑推理技能；'}
                {skills.consistencyCheck < 60 && '练习一致性检验；'}
                {skills.attentionAnalysis < 60 && '学习注意力机制；'}
                {skills.decisionPath < 60 && '理解决策路径；'}
                {skills.overallLevel >= 75 && '继续保持优异表现！'}
                {skills.overallLevel >= 60 && skills.overallLevel < 75 && '继续努力，你已经在正确的道路上！'}
                {skills.overallLevel < 60 && '建议从基础概念开始系统学习。'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}