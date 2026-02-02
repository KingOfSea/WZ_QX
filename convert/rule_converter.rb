#!/usr/bin/env ruby
# encoding: utf-8

# Quantumult X <-> Surge 规则转换器（支持重写规则和分流规则）
# 使用方法：
#   ruby rule_converter.rb input.conf output.sgmodule        # QX -> Surge
#   ruby rule_converter.rb input.sgmodule output.conf        # Surge -> QX
#   ruby rule_converter.rb input.conf                        # QX -> Surge (自动命名)
#   ruby rule_converter.rb input.sgmodule                    # Surge -> QX (自动命名)

class RuleConverter
  attr_reader :input_file, :output_file, :input_type, :rule_type

  # 分流规则关键字
  FILTER_RULE_KEYWORDS = %w[
    DOMAIN DOMAIN-SUFFIX DOMAIN-KEYWORD
    IP-CIDR IP-CIDR6 IP-ASN
    USER-AGENT URL-REGEX
    GEOIP FINAL
    HOST HOST-SUFFIX HOST-KEYWORD
    DEST-PORT SRC-IP
  ]

  def initialize(input_file, output_file = nil)
    @input_file = input_file
    @output_file = output_file
    @input_type = detect_type(input_file)
    @rule_type = detect_rule_type(input_file)

    unless File.exist?(input_file)
      raise "输入文件不存在: #{input_file}"
    end

    # 如果没有指定输出文件，自动生成
    if @output_file.nil?
      @output_file = auto_output_filename
    end

    puts "检测到输入类型: #{@input_type}"
    puts "检测到规则类型: #{@rule_type}"
    puts "输入文件: #{@input_file}"
    puts "输出文件: #{@output_file}"
  end

  def detect_type(filename)
    content = File.read(filename, encoding: 'UTF-8')

    # Surge 特征
    if filename =~ /\.(sgmodule|list)$/i || content.include?('[Script]') || content.include?('#!name=')
      :surge
    else
      :quantumult_x
    end
  end

  def detect_rule_type(filename)
    content = File.read(filename, encoding: 'UTF-8')
    lines = content.split("\n").reject { |l| l.strip.empty? || l.strip.start_with?('#') }

    return :unknown if lines.empty?

    # 检查是否包含分流规则
    filter_count = lines.count { |line| FILTER_RULE_KEYWORDS.any? { |kw| line.start_with?(kw) } }

    # 检查是否包含重写规则
    rewrite_count = lines.count { |line| line.include?('url script-') || line.include?('type=http-') }

    if filter_count > rewrite_count
      :filter
    elsif rewrite_count > 0
      :rewrite
    else
      :filter  # 默认当作分流规则
    end
  end

  def auto_output_filename
    base = File.basename(@input_file, '.*')
    dir = File.dirname(@input_file)

    if @input_type == :quantumult_x
      if @rule_type == :filter
        File.join(dir, "#{base}_surge.list")
      else
        File.join(dir, "#{base}_surge.sgmodule")
      end
    else
      File.join(dir, "#{base}_qx.conf")
    end
  end

  def convert
    case @rule_type
    when :filter
      convert_filter_rules
    when :rewrite
      convert_rewrite_rules
    else
      puts "⚠️  无法识别规则类型，尝试作为分流规则处理"
      convert_filter_rules
    end

    puts "\n✓ 转换完成！"
    puts "输出文件: #{@output_file}"
  end

  # 转换分流规则
  def convert_filter_rules
    if @input_type == :quantumult_x
      filter_qx_to_surge
    else
      filter_surge_to_qx
    end
  end

  # 转换重写规则
  def convert_rewrite_rules
    if @input_type == :quantumult_x
      rewrite_qx_to_surge
    else
      rewrite_surge_to_qx
    end
  end

  # 分流规则：Quantumult X -> Surge
  def filter_qx_to_surge
    content = File.read(@input_file, encoding: 'UTF-8')
    lines = content.split("\n")

    output = []
    current_comment = []

    lines.each do |line|
      line_stripped = line.strip

      # 保留空行
      if line_stripped.empty?
        output << "" unless output.last == ""
        next
      end

      # 保留注释
      if line_stripped.start_with?('#')
        current_comment << line
        next
      end

      # 处理分流规则 - QX和Surge格式基本相同
      if FILTER_RULE_KEYWORDS.any? { |kw| line_stripped.start_with?(kw) }
        # 输出注释
        current_comment.each { |c| output << c }

        # QX 和 Surge 的分流规则格式基本相同，直接复制
        output << line_stripped
        output << "" if current_comment.any?

        current_comment.clear
      else
        # 未识别的行作为注释
        output << "# #{line_stripped}" unless line_stripped.empty?
      end
    end

    # 移除末尾多余空行
    output.pop while output.last == ""

    File.write(@output_file, output.join("\n") + "\n", encoding: 'UTF-8')
  end

  # 分流规则：Surge -> Quantumult X
  def filter_surge_to_qx
    content = File.read(@input_file, encoding: 'UTF-8')
    lines = content.split("\n")

    output = []
    current_comment = []
    in_rule_section = false

    lines.each do |line|
      line_stripped = line.strip

      # 保留空行
      if line_stripped.empty?
        output << "" unless output.last == ""
        next
      end

      # 跳过模块头部信息
      next if line_stripped =~ /^#!(name|desc|system)/

      # 保留注释
      if line_stripped.start_with?('#')
        current_comment << line
        next
      end

      # 检测 [Rule] 区段
      if line_stripped =~ /^\[Rule\]$/i
        in_rule_section = true
        current_comment.clear
        next
      elsif line_stripped =~ /^\[.+\]$/
        in_rule_section = false
        next
      end

      # 处理分流规则
      if FILTER_RULE_KEYWORDS.any? { |kw| line_stripped.start_with?(kw) }
        # 输出注释
        current_comment.each { |c| output << c }

        # Surge 和 QX 的分流规则格式基本相同，直接复制
        output << line_stripped
        output << "" if current_comment.any?

        current_comment.clear
      end
    end

    # 移除开头和末尾的多余空行
    output.shift while output.first == ""
    output.pop while output.last == ""

    File.write(@output_file, output.join("\n") + "\n", encoding: 'UTF-8')
  end

  # 重写规则：Quantumult X -> Surge
  def rewrite_qx_to_surge
    content = File.read(@input_file, encoding: 'UTF-8')
    lines = content.split("\n")

    scripts = []
    url_rewrites = []
    hostnames = []
    current_comment = []

    lines.each do |line|
      line = line.strip

      # 跳过空行
      next if line.empty?

      # 保存注释
      if line.start_with?('#') && !line.start_with?('#!')
        current_comment << line
        next
      end

      # 处理 hostname
      if line =~ /^hostname\s*=\s*(.+)$/
        hostnames = $1.split(',').map(&:strip)
        current_comment.clear
        next
      end

      # 处理脚本规则: ^pattern url script-response-body path
      if line =~ /^(\^.+?)\s+url\s+script-(request|response)-(body|header)\s+(.+?)$/
        pattern = $1
        script_type = $2  # request or response
        script_part = $3  # body or header
        script_path = $4.strip

        # 生成名称（从注释中提取或使用默认名称）
        name = extract_name_from_comments(current_comment) || "Script#{scripts.length + 1}"

        # 构建 Surge 脚本规则
        surge_script = "#{name} = type=http-#{script_type}, pattern=#{pattern}, requires-body=#{script_part == 'body' ? '1' : '0'}, max-size=0, script-path=#{script_path}"

        scripts << {
          comments: current_comment.dup,
          rule: surge_script
        }
        current_comment.clear
        next
      end

      # 处理拦截规则: ^pattern url reject
      if line =~ /^(\^.+?)\s+url\s+(reject|reject-\w+)$/
        pattern = $1
        action = $2

        url_rewrites << {
          comments: current_comment.dup,
          rule: "#{pattern} - #{action}"
        }
        current_comment.clear
        next
      end
    end

    # 生成 Surge 配置
    output = []
    output << "#!name=重写规则"
    output << "#!desc=从 Quantumult X 转换"
    output << "#!system=ios"
    output << ""

    # 添加脚本部分
    if scripts.any?
      output << "[Script]"
      scripts.each do |item|
        item[:comments].each { |c| output << c }
        output << item[:rule]
        output << ""
      end
    end

    # 添加 URL Rewrite 部分
    if url_rewrites.any?
      output << "[URL Rewrite]"
      url_rewrites.each do |item|
        item[:comments].each { |c| output << c }
        output << item[:rule]
        output << ""
      end
    end

    # 添加 MITM 部分
    if hostnames.any?
      output << "[MITM]"
      output << "hostname = %APPEND% #{hostnames.join(', ')}"
    end

    File.write(@output_file, output.join("\n"), encoding: 'UTF-8')
  end

  # 重写规则：Surge -> Quantumult X
  def rewrite_surge_to_qx
    content = File.read(@input_file, encoding: 'UTF-8')
    lines = content.split("\n")

    output = []
    current_section = nil
    hostnames = []
    current_comment = []

    lines.each do |line|
      line = line.rstrip

      # 跳过空行
      if line.strip.empty?
        output << "" unless output.last == ""
        next
      end

      # 跳过模块头部信息
      next if line =~ /^#!(name|desc|system)/

      # 保存注释
      if line.strip.start_with?('#')
        current_comment << line
        next
      end

      # 检测区段
      if line =~ /^\[(.+?)\]$/
        current_section = $1.downcase
        current_comment.clear
        next
      end

      # 处理脚本规则
      if current_section == 'script'
        if line =~ /^.+?\s*=\s*type=http-(request|response).+?pattern=(.+?),.+?script-path=(.+?)(?:,|$)/
          script_type = $1
          pattern = $2.strip
          script_path = $3.strip
          script_part = line.include?('requires-body=1') ? 'body' : 'header'

          current_comment.each { |c| output << c }
          output << "#{pattern} url script-#{script_type}-#{script_part} #{script_path}"
          output << ""
          current_comment.clear
        end
      end

      # 处理 URL Rewrite 规则
      if current_section == 'url rewrite'
        if line =~ /^(.+?)\s+-\s+(reject[\w-]*)$/
          pattern = $1.strip
          action = $2.strip

          current_comment.each { |c| output << c }
          output << "#{pattern} url #{action}"
          output << ""
          current_comment.clear
        end
      end

      # 处理 MITM
      if current_section == 'mitm'
        if line =~ /^hostname\s*=\s*(.+)$/
          hosts = $1.gsub('%APPEND%', '').strip
          hostnames.concat(hosts.split(',').map(&:strip))
        end
      end
    end

    # 添加 hostname
    if hostnames.any?
      output.unshift("")
      output.unshift("hostname = #{hostnames.uniq.join(', ')}")
    end

    # 移除开头的空行
    output.shift while output.first == ""

    File.write(@output_file, output.join("\n"), encoding: 'UTF-8')
  end

  private

  def extract_name_from_comments(comments)
    return nil if comments.empty?

    last_comment = comments.last
    if last_comment =~ /^#\s*(.+?)(?:解锁|去广告|拦截|vip|VIP)?/
      name = $1.strip
      return name unless name.empty?
    end

    nil
  end
end

# 主程序
if __FILE__ == $0
  if ARGV.empty?
    puts "Quantumult X <-> Surge 规则转换器"
    puts "支持：重写规则（Rewrite）和分流规则（Filter）"
    puts ""
    puts "使用方法:"
    puts "  ruby #{File.basename(__FILE__)} input.conf [output.sgmodule]    # QX -> Surge"
    puts "  ruby #{File.basename(__FILE__)} input.sgmodule [output.conf]    # Surge -> QX"
    puts "  ruby #{File.basename(__FILE__)} input.list [output.conf]        # Surge -> QX"
    puts ""
    puts "如果不指定输出文件，将自动生成文件名"
    exit 1
  end

  begin
    converter = RuleConverter.new(ARGV[0], ARGV[1])
    converter.convert
  rescue => e
    puts "错误: #{e.message}"
    puts e.backtrace if ENV['DEBUG']
    exit 1
  end
end
