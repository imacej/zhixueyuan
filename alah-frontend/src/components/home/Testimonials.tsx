const testimonials = [
  {
    content: "ALAH的模型可视化工具让我第一次真正理解了Attention机制的工作原理。以前只是死记硬背公式，现在能看到模型的思考过程，真的太神奇了！",
    author: {
      name: '李明',
      role: '计算机系研究生',
      university: '清华大学',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    content: "作为传统行业转入AI的新手，最大的困惑是不知道如何系统学习。ALAH的个性化学习路径完美解决了这个问题，让我知道每一步该学什么。",
    author: {
      name: '张佳佳',
      role: '产品经理',
      company: '某互联网公司',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    content: "幻觉检测训练器是我用过最有趣的学习工具！游戏化的设计让学习变得很有趣，而且真的能提高对AI输出的批判性思维。现在我能很容易识别出模型的错误了。",
    author: {
      name: '王建华',
      role: 'AI工程师',
      company: '百度',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
];

export function Testimonials() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            用户评价
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            来自真实用户的声音
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            看看其他学习者如何通过ALAH提升他们的AI技能。
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  {/* 星星评分 */}
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-6">
                  “{testimonial.content}”
                </blockquote>
                
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={testimonial.author.imageUrl}
                    alt={testimonial.author.name}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.author.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.author.role}
                      {testimonial.author.company && ` · ${testimonial.author.company}`}
                      {testimonial.author.university && ` · ${testimonial.author.university}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 统计数据 */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">4.9/5</div>
              <div className="text-sm text-gray-500">用户评分</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">98%</div>
              <div className="text-sm text-gray-500">推荐率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">85%</div>
              <div className="text-sm text-gray-500">完成率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">24/7</div>
              <div className="text-sm text-gray-500">支持服务</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}